import React, { useState, useEffect } from "react";
import { X, Loader } from "lucide-react";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

const ExerciseDetailModal = ({ isOpen, onClose, exerciseName }) => {
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExerciseDetails = async () => {
            if (!isOpen || !exerciseName) return;

            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/exercises`,
                    {
                        headers: {
                            Authorization: localStorage.getItem("token"),
                        },
                    }
                );

                const exerciseData = response.data.find(
                    (ex) =>
                        ex.name.toLowerCase().trim() ===
                        exerciseName.toLowerCase().trim()
                );

                if (exerciseData) {
                    setExercise(exerciseData);
                } else {
                    const fuzzyMatch = response.data.find(
                        (ex) =>
                            ex.name
                                .toLowerCase()
                                .includes(exerciseName.toLowerCase().trim()) ||
                            exerciseName
                                .toLowerCase()
                                .trim()
                                .includes(ex.name.toLowerCase())
                    );

                    if (fuzzyMatch) {
                        setExercise(fuzzyMatch);
                    } else {
                        setError("Exercise details not found");
                    }
                }
            } catch (err) {
                console.error("Error details:", err);
                setError("Failed to load exercise details");
            } finally {
                setLoading(false);
            }
        };

        fetchExerciseDetails();
    }, [isOpen, exerciseName]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden relative">
                <div className="p-4 border-b flex justify-between items-center bg-blue-600 text-white">
                    <h2 className="text-xl font-semibold">
                        {loading ? (
                            <LoadingSpinner />
                        ) : (
                            exercise?.name || exerciseName
                        )}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-blue-700 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : error ? (
                        <div className="text-red-500 text-center py-4">
                            {error}
                            <div className="mt-2 text-sm text-gray-500">
                                Searched for: "{exerciseName}"
                            </div>
                        </div>
                    ) : exercise ? (
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
                                                <li
                                                    key={index}
                                                    className="pl-2"
                                                >
                                                    {instruction}
                                                </li>
                                            )
                                        )}
                                    </ol>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default ExerciseDetailModal;
