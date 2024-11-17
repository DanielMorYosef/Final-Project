import React, { useState, useEffect } from "react";
import { Play, X, Plus, Minus, Save, Clock, Star, Trash2 } from "lucide-react";
import axios from "axios";
import { useToast } from "../utils/ToastContext";
import ExerciseHeader from "./ExerciseHeader";
import LoadingSpinner from "./LoadingSpinner";

const predefinedWorkouts = [
    {
        id: "full-body-1",
        name: "Full Body Workout",
        duration: "60 minutes",
        exerciseCount: 8,
        exercises: [
            {
                name: "Barbell Squat",
                sets: [{ reps: 0, weight: 0 }],
                notes: "",
            },
            {
                name: "Barbell Bench Press",
                sets: [{ reps: 0, weight: 0 }],
                notes: "",
            },
            { name: "Barbell Row", sets: [{ reps: 0, weight: 0 }], notes: "" },
            { name: "Deadlift", sets: [{ reps: 0, weight: 0 }], notes: "" },
            {
                name: "Shoulder Press",
                sets: [{ reps: 0, weight: 0 }],
                notes: "",
            },
            { name: "Pull-ups", sets: [{ reps: 0, weight: 0 }], notes: "" },
            { name: "Dips", sets: [{ reps: 0, weight: 0 }], notes: "" },
            { name: "Plank", sets: [{ reps: 0, weight: 0 }], notes: "" },
        ],
    },
    {
        id: "upper-body-1",
        name: "Upper Body Workout",
        duration: "45 minutes",
        exerciseCount: 6,
        exercises: [
            { name: "Bench Press", sets: [{ reps: 0, weight: 0 }], notes: "" },
            {
                name: "Bent Over Rows",
                sets: [{ reps: 0, weight: 0 }],
                notes: "",
            },
            {
                name: "Overhead Press",
                sets: [{ reps: 0, weight: 0 }],
                notes: "",
            },
            { name: "Lat Pulldown", sets: [{ reps: 0, weight: 0 }], notes: "" },
            {
                name: "Tricep Extension",
                sets: [{ reps: 0, weight: 0 }],
                notes: "",
            },
            { name: "Bicep Curls", sets: [{ reps: 0, weight: 0 }], notes: "" },
        ],
    },
    {
        id: "lower-body-1",
        name: "Lower Body Workout",
        duration: "45 minutes",
        exerciseCount: 6,
        exercises: [
            { name: "Squats", sets: [{ reps: 0, weight: 0 }], notes: "" },
            {
                name: "Romanian Deadlifts",
                sets: [{ reps: 0, weight: 0 }],
                notes: "",
            },
            { name: "Leg Press", sets: [{ reps: 0, weight: 0 }], notes: "" },
            {
                name: "Leg Extensions",
                sets: [{ reps: 0, weight: 0 }],
                notes: "",
            },
            { name: "Leg Curls", sets: [{ reps: 0, weight: 0 }], notes: "" },
            { name: "Calf Raises", sets: [{ reps: 0, weight: 0 }], notes: "" },
        ],
    },
];

const StartWorkout = () => {
    const [userWorkouts, setUserWorkouts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [workoutProgress, setWorkoutProgress] = useState(null);
    const [workoutTimer, setWorkoutTimer] = useState(0);
    const [timerInterval, setTimerInterval] = useState(null);
    const { addToast } = useToast();

    useEffect(() => {
        const savedWorkout = localStorage.getItem("selectedWorkout");
        if (savedWorkout) {
            const workout = JSON.parse(savedWorkout);
            handleStartWorkout(workout);
            localStorage.removeItem("selectedWorkout");
        }
    }, []);

    useEffect(() => {
        const fetchUserWorkouts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/workouts`,
                    {
                        headers: {
                            Authorization: localStorage.getItem("token"),
                        },
                    }
                );
                setUserWorkouts(response.data);
            } catch (err) {
                console.error("Error fetching workouts:", err);
                setError("Failed to fetch workouts");
            } finally {
                setLoading(false);
            }
        };

        fetchUserWorkouts();
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

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const handleStartWorkout = (workout) => {
        setWorkoutTimer(0);

        const exercisesWithNames = workout.exercises.map((exercise) => {
            if (exercise.exercise) {
                // For user-created workouts
                return {
                    name: exercise.exercise.name || "Unknown Exercise",
                    sets: [{ reps: 0, weight: 0 }],
                    notes: "",
                };
            } else {
                // For predefined workouts
                return {
                    name: exercise.name,
                    sets: [{ reps: 0, weight: 0 }],
                    notes: "",
                };
            }
        });

        setWorkoutProgress({
            workoutId: workout.id || workout._id,
            workoutName: workout.name,
            startTime: new Date(),
            exercises: exercisesWithNames,
        });
        setSelectedWorkout(workout);
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
            addToast("Workout completed successfully!", "success");
            setSelectedWorkout(null);
            setWorkoutProgress(null);
            setWorkoutTimer(0);
            setError(null);
        } catch (err) {
            console.error("Error saving workout:", err);
            addToast("Failed to save workout progress", "error");
            setError("Failed to save workout progress");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (workoutId) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this workout? This will also delete all workout history associated with this workout."
            )
        ) {
            return;
        }

        try {
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/workouts/${workoutId}`,
                {
                    headers: { Authorization: localStorage.getItem("token") },
                }
            );

            // Update local state
            setUserWorkouts((prevWorkouts) =>
                prevWorkouts.filter((w) => w._id !== workoutId)
            );

            addToast(
                "Workout and associated history deleted successfully",
                "success"
            );
        } catch (err) {
            console.error("Error deleting workout:", err);
            setError("Failed to delete workout");
            addToast("Failed to delete workout", "error");
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

            setUserWorkouts((prevWorkouts) =>
                prevWorkouts.map((w) => {
                    if (w._id === workout._id) {
                        return {
                            ...w,
                            isFavorite: response.data.isFavorite,
                        };
                    }
                    return w;
                })
            );
            addToast("Favorite status updated successfully!", "success");
        } catch (error) {
            console.error("Error toggling favorite:", error);
            setError("Failed to update favorite status");
            addToast("Failed to update favorite status", "error");
        }
    };
    if (loading) {
        <LoadingSpinner />;
    }

    // Render active workout
    if (selectedWorkout && workoutProgress) {
        return (
            <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">
                            {selectedWorkout.name}
                        </h2>
                        <div className="flex items-center text-gray-600 mt-2">
                            <Clock size={20} className="mr-2" />
                            <span>{formatTime(workoutTimer)}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            if (
                                window.confirm(
                                    "Are you sure you want to end this workout?"
                                )
                            ) {
                                if (timerInterval) {
                                    clearInterval(timerInterval);
                                    setTimerInterval(null);
                                }
                                setSelectedWorkout(null);
                                setWorkoutProgress(null);
                                setWorkoutTimer(0);
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
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center space-x-2"
                    >
                        <Save size={20} />
                        <span>{loading ? "Saving..." : "Finish Workout"}</span>
                    </button>
                </div>
            </div>
        );
    }

    // Render workout selection
    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <h2 className="text-xl font-semibold mb-4">
                Sample Workouts Ready To Use
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {predefinedWorkouts.map((workout) => (
                    <div
                        key={workout.id}
                        className="bg-white p-6 rounded-lg shadow"
                    >
                        <div className="flex justify-between text-left items-start">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {workout.name}
                                </h3>
                                <p className="text-gray-600 mt-1">
                                    {workout.exerciseCount} exercises
                                </p>
                                <div className="mt-2 text-sm text-gray-500">
                                    {workout.exercises
                                        .slice(0, 3)
                                        .map((ex, idx) => (
                                            <div key={idx}>• {ex.name}</div>
                                        ))}
                                    {workout.exercises.length > 3 && (
                                        <div>
                                            • ... {workout.exercises.length - 3}{" "}
                                            more
                                        </div>
                                    )}
                                </div>
                            </div>
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

            <h2 className="text-xl font-semibold mb-4 mt-8">Your Workouts</h2>
            {loading ? (
                <div className="text-center py-4">Loading your workouts...</div>
            ) : userWorkouts.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                    No custom workouts yet. Create your first workout to get
                    started!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userWorkouts.map((workout) => (
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
                                        {workout.exercises?.length || 0}{" "}
                                        exercises
                                    </p>
                                    <div className="mt-2 text-sm text-gray-500">
                                        {workout.exercises
                                            ?.slice(0, 3)
                                            .map((ex, idx) => (
                                                <div key={idx}>
                                                    •{" "}
                                                    {ex?.name ||
                                                        "Unknown Exercise"}
                                                </div>
                                            ))}
                                        {workout.exercises?.length > 3 && (
                                            <div>
                                                • ...{" "}
                                                {workout.exercises.length - 3}{" "}
                                                more
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={(e) =>
                                            toggleFavorite(workout, e)
                                        }
                                        className="focus:outline-none hover:scale-110 transition-transform"
                                        title={
                                            workout.isFavorite
                                                ? "Remove from favorites"
                                                : "Add to favorites"
                                        }
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
                                    <button
                                        onClick={() =>
                                            handleDelete(workout._id)
                                        }
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                        title="Delete workout"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
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
            )}

            {error && (
                <div className="fixed bottom-4 right-4 bg-red-100 text-red-600 px-4 py-2 rounded-lg shadow">
                    {error}
                </div>
            )}
        </div>
    );
};

export default StartWorkout;
