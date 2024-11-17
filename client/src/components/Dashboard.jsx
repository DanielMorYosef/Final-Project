import React, { useState, useEffect } from "react";
import {
    Home,
    PlusCircle,
    Star,
    Play,
    Clock,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Trophy,
    Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CreateWorkout from "./CreateWorkout";
import StartWorkout from "./StartWorkout";
import FavoriteWorkouts from "./FavoriteWorkouts";
import RecentWorkouts from "./RecentWorkouts";
import ManageExercises from "./ManageExercises";
import { jwtDecode } from "jwt-decode";
import { useToast } from "../utils/ToastContext";
import LoadingSpinner from "./LoadingSpinner";

const DashboardOverview = ({ setActiveItem }) => {
    const [stats, setStats] = useState({
        totalWorkouts: 0,
        lastWorkoutDays: 0,
        personalBest: { exercise: "", weight: 0 },
    });
    const [favoriteWorkouts, setFavoriteWorkouts] = useState([]);
    const [recentWorkouts, setRecentWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    const fetchWorkoutById = async (workoutId) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/workouts/${workoutId}`,
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching workout:", error);
            return null;
        }
    };

    const fetchAndUpdateStats = async () => {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const startDate = thirtyDaysAgo.toISOString();

            const [logsResponse, workoutsResponse] = await Promise.all([
                axios.get(
                    `${process.env.REACT_APP_API_URL}/workout-logs?startDate=${startDate}&limit=1000`,
                    {
                        headers: {
                            Authorization: localStorage.getItem("token"),
                        },
                    }
                ),
                axios.get(`${process.env.REACT_APP_API_URL}/workouts`, {
                    headers: { Authorization: localStorage.getItem("token") },
                }),
            ]);

            const workoutLogs = logsResponse.data.workoutLogs;
            const allWorkouts = workoutsResponse.data;

            let lastWorkoutDays =
                workoutLogs.length > 0
                    ? Math.floor(
                          (new Date() - new Date(workoutLogs[0].startTime)) /
                              (1000 * 60 * 60 * 24)
                      )
                    : 0;

            let maxWeight = 0;
            let bestExercise = "";

            workoutLogs.forEach((log) => {
                log.exercises.forEach((exercise) => {
                    exercise.sets.forEach((set) => {
                        if (set.weight > maxWeight) {
                            maxWeight = set.weight;
                            bestExercise = exercise.name;
                        }
                    });
                });
            });

            const favorites = allWorkouts
                .filter((workout) => workout.isFavorite)
                .slice(0, 3);

            const recent = [...workoutLogs]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 3);

            setStats({
                totalWorkouts: workoutLogs.length,
                lastWorkoutDays,
                personalBest: { exercise: bestExercise, weight: maxWeight },
            });
            setFavoriteWorkouts(favorites);
            setRecentWorkouts(recent);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAndUpdateStats();
        const interval = setInterval(fetchAndUpdateStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const toggleFavorite = async (workout, e) => {
        e.stopPropagation();
        try {
            let workoutToToggle = workout;
            if (workout.workoutId) {
                const originalWorkout = await fetchWorkoutById(
                    workout.workoutId
                );
                if (!originalWorkout) {
                    console.error("Could not find original workout");
                    return;
                }
                workoutToToggle = originalWorkout;
            }

            const response = await axios.patch(
                `${process.env.REACT_APP_API_URL}/workouts/${workoutToToggle._id}/favorite`,
                {},
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );

            const updatedWorkout = {
                ...response.data,
                exercises: workoutToToggle.exercises,
            };

            setRecentWorkouts((prev) =>
                prev.map((w) => {
                    if (w.workoutId === workoutToToggle._id) {
                        return { ...w, isFavorite: updatedWorkout.isFavorite };
                    }
                    return w;
                })
            );
            setFavoriteWorkouts((prev) => {
                if (updatedWorkout.isFavorite) {
                    if (!prev.find((w) => w._id === updatedWorkout._id)) {
                        return [...prev.slice(0, 2), updatedWorkout];
                    }
                    return prev.map((w) =>
                        w._id === workoutToToggle._id ? updatedWorkout : w
                    );
                } else {
                    return prev.filter((w) => w._id !== workoutToToggle._id);
                }
            });
            addToast("Favorite status updated successfully", "success");
        } catch (error) {
            console.error("Error toggling favorite:", error);
            addToast("Failed to update workout", "error");
        }
    };

    const WorkoutCard = ({ workout, setActiveItem }) => {
        const workoutId = workout._id || workout.workoutId;

        const workoutName = workout.name || workout.workoutName;

        const predefinedWorkoutIds = [
            "full-body-1",
            "upper-body-1",
            "lower-body-1",
        ];
        const predefinedWorkoutNames = [
            "Full Body Workout",
            "Upper Body Workout",
            "Lower Body Workout",
        ];

        // Check if the workout is predefined
        const isPredefinedWorkout =
            (workout.workoutId &&
                predefinedWorkoutIds.includes(workout.workoutId)) ||
            (workoutName && predefinedWorkoutNames.includes(workoutName));

        const handleStartWorkout = (workout) => {
            const formattedWorkout = {
                _id: workout._id || workout.workoutId,
                name: workout.name || workout.workoutName,
                exercises: workout.exercises.map((ex) => ({
                    exercise: {
                        name: ex.name || ex.exercise?.name,
                        ...ex.exercise,
                    },
                    sets: [{ reps: 0, weight: 0 }],
                    notes: ex.notes || "",
                })),
            };

            setActiveItem("Start Workout");
            localStorage.setItem(
                "selectedWorkout",
                JSON.stringify(formattedWorkout)
            );
        };
        if (loading) {
            <LoadingSpinner />;
        }

        return (
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between text-left items-start">
                    <div>
                        <h3 className="text-lg font-semibold">{workoutName}</h3>
                        <p className="text-gray-600 mt-1">
                            {workout.exercises?.length || 0} exercises
                        </p>
                        <div className="mt-2 text-sm text-gray-500">
                            {workout.exercises?.slice(0, 3).map((ex, idx) => (
                                <div key={idx}>
                                    •{" "}
                                    {ex?.name ||
                                        ex?.exercise?.name ||
                                        "Unknown Exercise"}
                                </div>
                            ))}
                            {workout.exercises?.length > 3 && (
                                <div>
                                    • ... {workout.exercises.length - 3} more
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Only show the star button if it is not a predefined workout */}
                    {!isPredefinedWorkout && (
                        <button
                            onClick={(e) =>
                                toggleFavorite(
                                    { ...workout, _id: workoutId },
                                    e
                                )
                            }
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
                    )}
                </div>
                <button
                    onClick={() => handleStartWorkout(workout)}
                    className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
                >
                    <Play size={16} className="mr-1" />
                    Start Workout
                </button>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center space-x-2">
                        <Calendar className="text-blue-600" size={24} />
                        <h3 className="text-lg font-semibold">
                            Monthly Workouts
                        </h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                        {loading ? "..." : stats.totalWorkouts}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Last 30 days</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center space-x-2">
                        <Clock className="text-green-600" size={24} />
                        <h3 className="text-lg font-semibold">Last Workout</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                        {loading
                            ? "..."
                            : `${stats.lastWorkoutDays} ${
                                  stats.lastWorkoutDays === 1 ? "day" : "days"
                              }`}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Days since last workout
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center space-x-2">
                        <Trophy className="text-purple-600" size={24} />
                        <h3 className="text-lg font-semibold">Personal Best</h3>
                    </div>
                    {loading ? (
                        <p className="text-xl text-gray-500 mt-2">Loading...</p>
                    ) : stats.personalBest.exercise ? (
                        <>
                            <p className="text-2xl font-bold text-purple-600 mt-2">
                                {stats.personalBest.exercise}
                            </p>
                            <p className="text-xl font-semibold text-purple-600">
                                {stats.personalBest.weight} kg
                            </p>
                        </>
                    ) : (
                        <p className="text-xl text-gray-500 mt-2">
                            No lifts recorded yet
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Favorite Workouts
                        </h2>
                        <button
                            onClick={() => setActiveItem("Favorite Workouts")}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            View All
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {favoriteWorkouts.map((workout) => (
                            <WorkoutCard
                                key={workout._id}
                                workout={workout}
                                setActiveItem={setActiveItem}
                            />
                        ))}
                    </div>
                </div>

                {/* Recent Workouts section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Recent Workouts
                        </h2>
                        <button
                            onClick={() => setActiveItem("Recent Workouts")}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            View All
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recentWorkouts.map((workout) => (
                            <WorkoutCard
                                key={workout._id || workout.workoutId}
                                workout={workout}
                                setActiveItem={setActiveItem}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState("Dashboard");
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const { addToast } = useToast();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setIsAdmin(decoded.isAdmin);
            } catch (error) {
                console.error("Failed to decode token:", error.message);
            }
        }
    }, []);

    const menuItems = [
        {
            title: "Dashboard",
            icon: <Home size={20} />,
            component: <DashboardOverview setActiveItem={setActiveItem} />,
        },
        {
            title: "Start Workout",
            icon: <Play size={20} />,
            component: <StartWorkout />,
        },
        {
            title: "Create Workout",
            icon: <PlusCircle size={20} />,
            component: <CreateWorkout />,
        },
        {
            title: "Favorite Workouts",
            icon: <Star size={20} />,
            component: <FavoriteWorkouts />,
        },
        {
            title: "Recent Workouts",
            icon: <Clock size={20} />,
            component: <RecentWorkouts />,
        },
        // Only show the Manage Exercises menu item if the user is an admin
        ...(isAdmin
            ? [
                  {
                      title: "Manage Exercises",
                      icon: <Wrench size={20} />,
                      component: <ManageExercises />,
                  },
              ]
            : []),
    ];

    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to log out?")) {
            try {
                localStorage.removeItem("token");
                delete axios.defaults.headers.common["Authorization"];
                addToast("Successfully logged out", "info");
                navigate("/");
            } catch (error) {
                console.error("Logout error:", error);
                localStorage.removeItem("token");
                addToast("Failed to logout properly", "error");
                navigate("/");
            }
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div
                className={`${
                    isCollapsed ? "w-16" : "w-64"
                } bg-white h-full shadow-lg transition-all duration-300`}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <div
                        className={`flex items-center ${
                            isCollapsed ? "justify-center" : "space-x-4"
                        }`}
                    >
                        {!isCollapsed && (
                            <img
                                src="/photos/logo.png"
                                className="w-8 h-8"
                                alt="logo"
                            />
                        )}
                        {!isCollapsed && (
                            <span className="font-semibold text-xl">
                                Workout App
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1 rounded-full hover:bg-gray-100"
                    >
                        {isCollapsed ? (
                            <ChevronRight size={20} />
                        ) : (
                            <ChevronLeft size={20} />
                        )}
                    </button>
                </div>

                <nav className="mt-6">
                    {menuItems.map((item) => (
                        <button
                            key={item.title}
                            onClick={() => setActiveItem(item.title)}
                            className={`flex items-center w-full p-4 space-x-4
                                ${
                                    isCollapsed
                                        ? "justify-center"
                                        : "justify-start"
                                }
                                ${
                                    activeItem === item.title
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {item.icon}
                            {!isCollapsed && <span>{item.title}</span>}
                        </button>
                    ))}
                </nav>

                <div className="border-t w-full mt-auto">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center w-full p-4 text-red-600
                            ${
                                isCollapsed
                                    ? "justify-center"
                                    : "justify-start space-x-3"
                            }`}
                    >
                        <LogOut size={20} />
                        {!isCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </div>

            <div className="flex-1 p-8 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                        {activeItem}
                    </h1>
                    {
                        menuItems.find((item) => item.title === activeItem)
                            ?.component
                    }
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
