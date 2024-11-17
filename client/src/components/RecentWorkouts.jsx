import React, { useState, useEffect } from "react";
import { Calendar, Clock, Dumbbell } from "lucide-react";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

const RecentWorkouts = () => {
    const [recentWorkouts, setRecentWorkouts] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [dateWorkouts, setDateWorkouts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRecentWorkouts();
    }, []);

    useEffect(() => {
        if (selectedDate) {
            fetchWorkoutsByDate(selectedDate);
        }
    }, [selectedDate]);

    const fetchRecentWorkouts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/workout-logs/recent`,
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );
            setRecentWorkouts(response.data.slice(0, 6)); // Limit to 6 most recent workouts
        } catch (err) {
            setError("Failed to fetch recent workouts");
            console.error(err);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchWorkoutsByDate = async (date) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/workout-logs/date/${date}`,
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );
            setDateWorkouts(response.data);
        } catch (err) {
            setError("Failed to fetch workouts for selected date");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString();
    };

    const formatDuration = (minutes) => {
        return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
    };

    return (
        <div className="space-y-6">
            {/* Recent Workouts Section */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        Recent Workouts
                    </h2>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : recentWorkouts.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        No recent workouts found
                    </div>
                ) : (
                    <div className="divide-y">
                        {recentWorkouts.map((workout, index) => (
                            <div key={index} className="p-4 hover:bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-medium text-gray-900">
                                            {workout.workoutName}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(workout.startTime)} at{" "}
                                            {formatTime(workout.startTime)}
                                        </p>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {formatDuration(workout.duration)}
                                    </span>
                                </div>

                                <div className="mt-2 space-y-2">
                                    {workout.exercises.map(
                                        (exercise, exIndex) => (
                                            <div
                                                key={exIndex}
                                                className="text-sm"
                                            >
                                                <div className="font-medium text-gray-700 flex items-center">
                                                    <Dumbbell className="w-4 h-4 mr-1" />
                                                    {exercise.name}
                                                </div>
                                                <div className="ml-5 text-gray-600 grid grid-cols-2 gap-2 sm:grid-cols-3 mt-1">
                                                    {exercise.sets.map(
                                                        (set, setIndex) => (
                                                            <div key={setIndex}>
                                                                Set{" "}
                                                                {setIndex + 1}:{" "}
                                                                {set.weight}kg ×{" "}
                                                                {set.reps}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Date Picker Section */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Search Workouts by Date
                    </h2>
                </div>

                <div className="p-4">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-2 border rounded-md mb-4"
                    />

                    {selectedDate && (
                        <div className="space-y-4">
                            <h3 className="font-medium text-gray-900">
                                Workouts on{" "}
                                {new Date(selectedDate).toLocaleDateString(
                                    "en-GB"
                                )}
                            </h3>

                            {loading ? (
                                <div className="text-center text-gray-500">
                                    Loading...
                                </div>
                            ) : dateWorkouts.length === 0 ? (
                                <div className="text-center text-gray-500">
                                    No workouts found for this date
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {dateWorkouts.map((workout, index) => (
                                        <div
                                            key={index}
                                            className="border rounded-lg p-4"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">
                                                        {workout.workoutName}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {formatTime(
                                                            workout.startTime
                                                        )}{" "}
                                                        -{" "}
                                                        {formatDuration(
                                                            workout.duration
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-3 space-y-3">
                                                {workout.exercises.map(
                                                    (exercise, exIndex) => (
                                                        <div
                                                            key={exIndex}
                                                            className="text-sm"
                                                        >
                                                            <div className="font-medium text-gray-700 flex items-center">
                                                                <Dumbbell className="w-4 h-4 mr-1" />
                                                                {exercise.name}
                                                            </div>
                                                            <div className="ml-5 text-gray-600 grid grid-cols-2 gap-2 sm:grid-cols-3 mt-1">
                                                                {exercise.sets.map(
                                                                    (
                                                                        set,
                                                                        setIndex
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                setIndex
                                                                            }
                                                                        >
                                                                            Set{" "}
                                                                            {setIndex +
                                                                                1}
                                                                            :{" "}
                                                                            {
                                                                                set.weight
                                                                            }
                                                                            kg ×{" "}
                                                                            {
                                                                                set.reps
                                                                            }
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecentWorkouts;
