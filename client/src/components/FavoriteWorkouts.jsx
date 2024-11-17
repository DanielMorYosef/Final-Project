import React, { useState, useEffect } from "react";
import { Play, Star, Loader, X, Minus, Plus } from "lucide-react";
import axios from "axios";
import { useToast } from "../utils/ToastContext";
import ExerciseHeader from "./ExerciseHeader";

const FavoriteWorkouts = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [workoutProgress, setWorkoutProgress] = useState(null);
    const [workoutTimer, setWorkoutTimer] = useState(0);
    const [timerInterval, setTimerInterval] = useState(null);
    const { addToast } = useToast();

    useEffect(() => {
        fetchWorkouts();
    }, []);

    useEffect(() => {
        if (selectedWorkout && !timerInterval) {
            const interval = setInterval(() => {
                setWorkoutTimer((prev) => prev + 1);
            }, 1000);
            setTimerInterval(interval);
        }

        return () => {
            if (timerInterval) {
                clearInterval(timerInterval);
            }
        };
    }, [selectedWorkout, timerInterval]);

    const fetchWorkouts = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/workouts`,
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );
            setWorkouts(response.data);
        } catch (err) {
            setError("Failed to fetch workouts");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const handleStartWorkout = (workout) => {
        setWorkoutTimer(0);

        const exercisesWithNames = workout.exercises.map((exercise) => ({
            name: exercise?.name || "Unknown Exercise",
            sets: [{ reps: 0, weight: 0 }],
            notes: "",
            originalExercise: exercise.exercise,
        }));

        setWorkoutProgress({
            workoutId: workout._id,
            workoutName: workout.name,
            startTime: new Date(),
            exercises: exercisesWithNames,
        });
        setSelectedWorkout(workout);
    };

    const handleFinishWorkout = async () => {
        try {
            setLoading(true);
            if (timerInterval) {
                clearInterval(timerInterval);
                setTimerInterval(null);
            }

            const workoutData = {
                workoutId: workoutProgress.workoutId,
                workoutName: workoutProgress.workoutName,
                startTime: workoutProgress.startTime,
                endTime: new Date(),
                duration: Math.round(workoutTimer / 60),
                exercises: workoutProgress.exercises.map((exercise) => ({
                    name: exercise.name,
                    sets: exercise.sets.map((set) => ({
                        reps: Number(set.reps),
                        weight: Number(set.weight),
                    })),
                    notes: exercise.notes || "",
                })),
            };

            await axios.post(
                `${process.env.REACT_APP_API_URL}/workout-logs`,
                workoutData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );

            setSelectedWorkout(null);
            setWorkoutProgress(null);
            setWorkoutTimer(0);
            addToast("Workout saved successfully", "success");
            setError(null);
        } catch (err) {
            console.error("Error saving workout:", err);
            setError("Failed to save workout progress");
            addToast("Failed to save workout progress", "error");
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (workout, e) => {
        e.stopPropagation();
        try {
            const response = await axios.patch(
                `${process.env.REACT_APP_API_URL}/workouts/${workout._id}/favorite`,
                {},
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );

            setWorkouts((prevWorkouts) =>
                prevWorkouts.map((w) =>
                    w._id === workout._id ? response.data : w
                )
            );
            addToast("Favorite status updated", "success");
        } catch (error) {
            console.error("Error toggling favorite:", error);
            addToast("Failed to update favorite status", "error");
        }
    };

    const updateSet = (exerciseIndex, setIndex, field, value) => {
        const updatedProgress = { ...workoutProgress };
        updatedProgress.exercises[exerciseIndex].sets[setIndex][field] =
            Number(value);
        setWorkoutProgress(updatedProgress);
    };

    const addSet = (exerciseIndex) => {
        const updatedProgress = { ...workoutProgress };
        updatedProgress.exercises[exerciseIndex].sets.push({
            reps: 0,
            weight: 0,
        });
        setWorkoutProgress(updatedProgress);
    };

    const removeSet = (exerciseIndex, setIndex) => {
        if (workoutProgress.exercises[exerciseIndex].sets.length > 1) {
            const updatedProgress = { ...workoutProgress };
            updatedProgress.exercises[exerciseIndex].sets.splice(setIndex, 1);
            setWorkoutProgress(updatedProgress);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-600 bg-red-50 rounded-lg">
                <p>{error}</p>
            </div>
        );
    }

    const favoriteWorkouts = workouts.filter((workout) => workout.isFavorite);

    if (selectedWorkout && workoutProgress) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">
                            {selectedWorkout.name}
                        </h2>
                        <div className="flex items-center text-gray-600 mt-2">
                            <span className="mr-2">Time:</span>
                            {formatTime(workoutTimer)}
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            if (
                                window.confirm(
                                    "Are you sure you want to end this workout?"
                                )
                            ) {
                                setSelectedWorkout(null);
                                setWorkoutProgress(null);
                                setWorkoutTimer(0);
                                if (timerInterval) {
                                    clearInterval(timerInterval);
                                    setTimerInterval(null);
                                }
                            }
                        }}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-6">
                    {workoutProgress.exercises.map(
                        (exercise, exerciseIndex) => (
                            <div
                                key={exerciseIndex}
                                className="border rounded-lg p-4"
                            >
                                <ExerciseHeader exercise={exercise} />

                                <div className="space-y-3">
                                    {exercise.sets.map((set, setIndex) => (
                                        <div
                                            key={setIndex}
                                            className="flex flex-wrap items-center gap-4 sm:flex-nowrap"
                                        >
                                            <span className="text-sm text-gray-500 w-16 shrink-0">
                                                Set {setIndex + 1}
                                            </span>

                                            <div className="flex flex-wrap gap-4 grow sm:flex-nowrap">
                                                <div className="flex flex-col w-24 shrink-0">
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
                                                        className="px-2 py-1 border rounded w-full"
                                                        min="0"
                                                        step="0.5"
                                                    />
                                                </div>

                                                <div className="flex flex-col w-20 shrink-0">
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
                                                        className="px-2 py-1 border rounded w-full"
                                                        min="0"
                                                    />
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        removeSet(
                                                            exerciseIndex,
                                                            setIndex
                                                        )
                                                    }
                                                    className="text-red-500 hover:text-red-700 self-end shrink-0 pb-1"
                                                    disabled={
                                                        exercise.sets.length ===
                                                        1
                                                    }
                                                >
                                                    <Minus size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => addSet(exerciseIndex)}
                                    className="mt-3 text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                                >
                                    <Plus size={16} />
                                    <span>Add Set</span>
                                </button>
                            </div>
                        )
                    )}

                    <button
                        onClick={handleFinishWorkout}
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md
                                 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? "Saving..." : "Finish Workout"}
                    </button>
                </div>
            </div>
        );
    }

    if (favoriteWorkouts.length === 0) {
        return (
            <div className="text-center py-8 bg-white rounded-lg shadow">
                <p className="text-gray-500">
                    No favorite workouts yet. Star some workouts to see them
                    here!
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteWorkouts.map((workout) => (
                <div
                    key={workout._id}
                    className="bg-white p-6 rounded-lg shadow"
                >
                    <div className="flex justify-between text-left items-start">
                        <div>
                            <h3 className="text-lg font-semibold">
                                {workout.name}
                            </h3>
                            <p className="text-gray-600 mt-1">
                                {workout.exercises?.length || 0} exercises
                            </p>
                            <div className="mt-2 text-sm text-gray-500">
                                {workout.exercises
                                    ?.slice(0, 3)
                                    .map((ex, idx) => (
                                        <div key={idx}>
                                            • {ex?.name || "Unknown Exercise"}
                                        </div>
                                    ))}
                                {workout.exercises?.length > 3 && (
                                    <div>
                                        • ... {workout.exercises.length - 3}{" "}
                                        more
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={(e) => toggleFavorite(workout, e)}
                            className="focus:outline-none"
                        >
                            <Star
                                size={24}
                                className={`${
                                    workout.isFavorite
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-400 hover:text-yellow-400"
                                } transition-colors`}
                            />
                        </button>
                    </div>
                    <button
                        onClick={() => handleStartWorkout(workout)}
                        className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
                    >
                        <Play size={16} className="mr-1" />
                        Start Workout
                    </button>
                </div>
            ))}
        </div>
    );
};

export default FavoriteWorkouts;
