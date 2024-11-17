import { useState } from "react";
import { Info, Loader, X } from "react-feather";

const Exercise = ({ exercise, onSelect, onInfo }) => {
    return (
        <div className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer group">
            <div className="flex-1" onClick={() => onSelect(exercise._id)}>
                <span className="font-medium">{exercise.name}</span>
                <span className="text-gray-500 text-sm block">
                    {exercise.primaryMuscles?.join(", ") ||
                        "No muscles specified"}
                </span>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onInfo(exercise);
                }}
                className="text-gray-400 hover:text-blue-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="View exercise details"
            >
                <Info size={18} />
            </button>
        </div>
    );
};

const ExerciseSelectionSection = ({
    exercises,
    loading,
    searchTerm,
    selectedMuscle,
    onExerciseAdd,
}) => {
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Add Exercises</h3>

            {/* Exercise List */}
            <div className="mt-4 border rounded-md divide-y max-h-96 overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <Loader className="w-6 h-6 animate-spin text-blue-600" />
                    </div>
                ) : exercises.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        No exercises found.
                    </div>
                ) : (
                    exercises.map((exercise) => (
                        <Exercise
                            key={exercise._id}
                            exercise={exercise}
                            onSelect={onExerciseAdd}
                            onInfo={(exercise) => {
                                setSelectedExercise(exercise);
                                setIsModalOpen(true);
                            }}
                        />
                    ))
                )}
            </div>

            {/* Exercise Detail Modal */}
            <ExerciseDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                exercise={selectedExercise}
            />
        </div>
    );
};

const ExerciseDetailModal = ({ isOpen, onClose, exercise }) => {
    if (!isOpen || !exercise) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden relative">
                <div className="p-4 border-b flex justify-between items-center bg-blue-600 text-white">
                    <h2 className="text-xl font-semibold">{exercise.name}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-blue-700 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {exercise.level && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Level
                                    </h3>
                                    <p className="mt-1 capitalize">
                                        {exercise.level}
                                    </p>
                                </div>
                            )}
                            {exercise.force && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Force
                                    </h3>
                                    <p className="mt-1 capitalize">
                                        {exercise.force}
                                    </p>
                                </div>
                            )}
                            {exercise.mechanic && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Mechanic
                                    </h3>
                                    <p className="mt-1 capitalize">
                                        {exercise.mechanic}
                                    </p>
                                </div>
                            )}
                            {exercise.equipment && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Equipment
                                    </h3>
                                    <p className="mt-1 capitalize">
                                        {exercise.equipment}
                                    </p>
                                </div>
                            )}
                            {exercise.category && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Category
                                    </h3>
                                    <p className="mt-1 capitalize">
                                        {exercise.category}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            {exercise.primaryMuscles?.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Primary Muscles
                                    </h3>
                                    <div className="mt-1 flex flex-wrap gap-2">
                                        {exercise.primaryMuscles.map(
                                            (muscle, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full capitalize"
                                                >
                                                    {muscle}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            {exercise.secondaryMuscles?.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Secondary Muscles
                                    </h3>
                                    <div className="mt-1 flex flex-wrap gap-2">
                                        {exercise.secondaryMuscles.map(
                                            (muscle, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-full capitalize"
                                                >
                                                    {muscle}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {exercise.instructions?.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">
                                    Instructions
                                </h3>
                                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                                    {exercise.instructions.map(
                                        (instruction, index) => (
                                            <li key={index} className="pl-2">
                                                {instruction}
                                            </li>
                                        )
                                    )}
                                </ol>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExerciseSelectionSection;
