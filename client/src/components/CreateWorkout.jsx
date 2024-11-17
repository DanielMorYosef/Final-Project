import React, { useState, useEffect } from "react";
import { Plus, Minus, Save, X, Search, Info } from "lucide-react";
import axios from "axios";
import { useToast } from "../utils/ToastContext";
import LoadingSpinner from "./LoadingSpinner";

const muscleGroups = [
    "all",
    "chest",
    "shoulders",
    "biceps",
    "triceps",
    "quadriceps",
    "hamstrings",
    "abdominals",
    "calves",
    "middle back",
    "traps",
    "lats",
];

const Exercise = ({ exercise, onSelect, onInfo }) => {
    return (
        <div className="flex items-center justify-between p-2 hover:bg-gray-50 border-b last:border-b-0">
            <div
                onClick={() => onSelect(exercise._id)}
                className="flex-1 cursor-pointer"
            >
                <span className="font-medium">{exercise.name}</span>
                <span className="text-gray-500 text-sm block">
                    {exercise.primaryMuscles?.join(", ") ||
                        "No muscles specified"}
                </span>
            </div>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onInfo(exercise);
                }}
                className="text-gray-400 hover:text-blue-600 p-2 ml-2"
                title="View exercise details"
            >
                <Info size={18} />
            </button>
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

const CreateWorkout = () => {
    const [exercises, setExercises] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [workoutName, setWorkoutName] = useState("");
    const [workoutDescription, setWorkoutDescription] = useState("");
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedMuscle, setSelectedMuscle] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        fetchExercises();
    }, []);

    useEffect(() => {
        if (exercises && exercises.length > 0) {
            filterExercises();
        }
    }, [exercises, selectedMuscle, searchTerm]);

    const fetchExercises = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/exercises`,
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );
            if (response.data) {
                setExercises(response.data);
                setFilteredExercises(response.data);
            }
        } catch (err) {
            setError("Failed to fetch exercises");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filterExercises = () => {
        let filtered = [...exercises];

        if (selectedMuscle && selectedMuscle !== "all") {
            filtered = filtered.filter((exercise) =>
                exercise?.primaryMuscles?.includes(selectedMuscle)
            );
        }

        if (searchTerm && searchTerm.trim() !== "") {
            filtered = filtered.filter((exercise) =>
                exercise?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredExercises(filtered);
    };

    const addExercise = (exerciseId) => {
        if (!exerciseId) return;
        const exercise = exercises.find((e) => e._id === exerciseId);
        if (exercise) {
            setSelectedExercises([
                ...selectedExercises,
                {
                    exercise: exerciseId,
                    sets: [{ reps: 0, weight: 0 }],
                    notes: "",
                },
            ]);
        }
    };

    const removeExercise = (exerciseIndex) => {
        const newSelected = [...selectedExercises];
        newSelected.splice(exerciseIndex, 1);
        setSelectedExercises(newSelected);
    };

    const addSet = (exerciseIndex) => {
        const newSelected = [...selectedExercises];
        newSelected[exerciseIndex].sets.push({ reps: 0, weight: 0 });
        setSelectedExercises(newSelected);
    };

    const removeSet = (exerciseIndex, setIndex) => {
        if (selectedExercises[exerciseIndex].sets.length > 1) {
            const newSelected = [...selectedExercises];
            newSelected[exerciseIndex].sets.splice(setIndex, 1);
            setSelectedExercises(newSelected);
        }
    };

    const updateSet = (exerciseIndex, setIndex, field, value) => {
        const newSelected = [...selectedExercises];
        newSelected[exerciseIndex].sets[setIndex][field] = Number(value);
        setSelectedExercises(newSelected);
    };

    const updateNotes = (exerciseIndex, notes) => {
        const newSelected = [...selectedExercises];
        newSelected[exerciseIndex].notes = notes;
        setSelectedExercises(newSelected);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const workoutData = {
                name: workoutName,
                description: workoutDescription,
                exercises: selectedExercises,
            };

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/workouts`,
                workoutData,
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );

            if (response.status === 201) {
                setWorkoutName("");
                setWorkoutDescription("");
                setSelectedExercises([]);
                setError(null);
                addToast("Workout created successfully", "success");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create workout");
            console.error(err);
            addToast("Failed to create workout", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Workout Name
                    </label>
                    <input
                        type="text"
                        value={workoutName}
                        onChange={(e) => setWorkoutName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        value={workoutDescription}
                        onChange={(e) => setWorkoutDescription(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        rows="3"
                    />
                </div>

                <div className="space-y-4">
                    {/* Exercise Selection Section */}
                    <div className="border rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-4">
                            Add Exercises
                        </h3>

                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search exercises..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full pl-10 pr-3 py-2 border rounded-md"
                                />
                            </div>
                        </div>

                        {/* Quick Filter Pills */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {muscleGroups.map((muscle) => (
                                <button
                                    key={muscle}
                                    type="button"
                                    onClick={() =>
                                        setSelectedMuscle(
                                            muscle === selectedMuscle
                                                ? "all"
                                                : muscle
                                        )
                                    }
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        selectedMuscle === muscle
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {muscle.charAt(0).toUpperCase() +
                                        muscle.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Exercise List */}
                        <div className="border rounded-md divide-y max-h-96 overflow-y-auto">
                            {loading ? (
                                <LoadingSpinner />
                            ) : filteredExercises.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">
                                    No exercises found.
                                </div>
                            ) : (
                                filteredExercises.map((exercise) => (
                                    <Exercise
                                        key={exercise._id}
                                        exercise={exercise}
                                        onSelect={addExercise}
                                        onInfo={(exercise) => {
                                            setSelectedExercise(exercise);
                                            setIsModalOpen(true);
                                        }}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Selected Exercises List */}
                    <div className="space-y-4">
                        {selectedExercises.map((exercise, exerciseIndex) => (
                            <div
                                key={exerciseIndex}
                                className="border p-4 rounded-lg relative"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-medium">
                                        {
                                            exercises.find(
                                                (e) =>
                                                    e._id === exercise.exercise
                                            )?.name
                                        }
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeExercise(exerciseIndex)
                                        }
                                        className="text-red-500 hover:text-red-700 p-1"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {exercise.sets.map((set, setIndex) => (
                                        <div
                                            key={setIndex}
                                            className="flex flex-wrap md:flex-nowrap items-center gap-4"
                                        >
                                            <span className="text-sm text-gray-500 w-16 shrink-0">
                                                Set {setIndex + 1}
                                            </span>

                                            <div className="flex flex-1 gap-4 min-w-0">
                                                <div className="flex flex-col flex-1 min-w-0">
                                                    <label className="text-xs text-gray-500">
                                                        Weight (kg)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={set.weight}
                                                        onChange={(e) =>
                                                            updateSet(
                                                                exerciseIndex,
                                                                setIndex,
                                                                "weight",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full px-2 py-1 border rounded"
                                                        min="0"
                                                        step="0.5"
                                                    />
                                                </div>

                                                <div className="flex flex-col flex-1 min-w-0">
                                                    <label className="text-xs text-gray-500">
                                                        Reps
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={set.reps}
                                                        onChange={(e) =>
                                                            updateSet(
                                                                exerciseIndex,
                                                                setIndex,
                                                                "reps",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full px-2 py-1 border rounded"
                                                        min="0"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeSet(
                                                        exerciseIndex,
                                                        setIndex
                                                    )
                                                }
                                                className="text-red-600 hover:text-red-800 shrink-0"
                                                disabled={
                                                    exercise.sets.length === 1
                                                }
                                            >
                                                <Minus size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 flex flex-col md:flex-row gap-4">
                                    <button
                                        type="button"
                                        onClick={() => addSet(exerciseIndex)}
                                        className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                                    >
                                        <Plus size={16} />
                                        <span>Add Set</span>
                                    </button>

                                    <input
                                        type="text"
                                        value={exercise.notes}
                                        onChange={(e) =>
                                            updateNotes(
                                                exerciseIndex,
                                                e.target.value
                                            )
                                        }
                                        className="flex-1 px-2 py-1 border rounded"
                                        placeholder="Notes for this exercise"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || selectedExercises.length === 0}
                    className={`w-full py-2 px-4 rounded-md flex items-center justify-center space-x-2
                        ${
                            loading || selectedExercises.length === 0
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        } 
                        text-white`}
                >
                    <Save size={20} />
                    <span>{loading ? "Creating..." : "Create Workout"}</span>
                </button>
            </form>

            {/* Exercise Detail Modal */}
            <ExerciseDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                exercise={selectedExercise}
            />
        </div>
    );
};

export default CreateWorkout;
