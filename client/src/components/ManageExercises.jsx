import React, { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, X, AlertCircle } from "lucide-react";
import axios from "axios";
import { useExercises } from "../utils/exerciseContext";
import { useToast } from "../utils/ToastContext";

const ManageExercises = () => {
    const { exercises, updateExercises } = useExercises();
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMuscle, setSelectedMuscle] = useState("all");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingExercise, setEditingExercise] = useState(null);
    const { addToast } = useToast();

    const [form, setForm] = useState({
        name: "",
        force: "",
        level: "",
        mechanic: "",
        equipment: "",
        primaryMuscles: [],
        secondaryMuscles: [],
        instructions: [],
        category: "",
    });

    const levels = ["beginner", "intermediate", "expert"];
    const categories = ["strength"];
    const forces = ["push", "pull", "static"];
    const mechanics = ["compound", "isolation"];
    const muscleGroups = [
        "chest",
        "shoulders",
        "biceps",
        "triceps",
        "quadriceps",
        "hamstrings",
        "calves",
        "abdominals",
        "lower back",
        "middle back",
        "lats",
        "traps",
        "forearms",
        "glutes",
    ];

    useEffect(() => {
        fetchExercises();
    }, []);

    useEffect(() => {
        filterExercises();
    }, [exercises, searchTerm, selectedMuscle]);

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
            updateExercises(response.data);
            setFilteredExercises(response.data);
        } catch (err) {
            setError("Failed to fetch exercises");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filterExercises = () => {
        if (!exercises) {
            setFilteredExercises([]);
            return;
        }

        let filtered = [...exercises];

        if (selectedMuscle && selectedMuscle !== "all") {
            filtered = filtered.filter((exercise) =>
                exercise?.primaryMuscles?.includes(selectedMuscle)
            );
        }

        if (searchTerm && searchTerm.trim() !== "") {
            filtered = filtered.filter(
                (exercise) =>
                    exercise?.name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) || false
            );
        }

        setFilteredExercises(filtered);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "primaryMuscles" || name === "secondaryMuscles") {
            setForm((prev) => ({
                ...prev,
                [name]: Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                ),
            }));
        } else if (name === "instructions") {
            setForm((prev) => ({
                ...prev,
                instructions: value.split("\n").filter((line) => line.trim()),
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = {
                ...form,
                primaryMuscles: Array.isArray(form.primaryMuscles)
                    ? form.primaryMuscles
                    : [],
                secondaryMuscles: Array.isArray(form.secondaryMuscles)
                    ? form.secondaryMuscles
                    : [],
                instructions: Array.isArray(form.instructions)
                    ? form.instructions
                    : typeof form.instructions === "string"
                    ? form.instructions
                          .split("\n")
                          .filter((line) => line.trim())
                    : [],
            };

            if (editingExercise) {
                const response = await axios.put(
                    `${process.env.REACT_APP_API_URL}/exercises/${editingExercise._id}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: localStorage.getItem("token"),
                        },
                    }
                );

                if (response.data) {
                    await fetchExercises();
                    setShowForm(false);
                    setEditingExercise(null);
                    resetForm();
                    addToast("Exercise updated successfully", "success");
                }
            } else {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/exercises`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: localStorage.getItem("token"),
                        },
                    }
                );

                if (response.data) {
                    await fetchExercises();
                    setShowForm(false);
                    resetForm();
                    addToast("Exercise added successfully", "success");
                }
            }
        } catch (err) {
            console.error("Submission error:", err);
            setError(
                err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Failed to save exercise"
            );
            addToast("Failed to save exercise", "error");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm({
            name: "",
            force: "",
            level: "",
            mechanic: "",
            equipment: "",
            primaryMuscles: [],
            secondaryMuscles: [],
            instructions: [],
            category: "",
        });
    };

    const handleEdit = (exercise) => {
        setEditingExercise(exercise);
        setForm({
            ...exercise,
            instructions: exercise.instructions || [],
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this exercise?"))
            return;

        try {
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/exercises/${id}`,
                {
                    headers: { Authorization: localStorage.getItem("token") },
                }
            );
            await fetchExercises();
            addToast("Exercise deleted successfully", "success");
        } catch (err) {
            setError("Failed to delete exercise");
            addToast("Failed to delete exercise", "error");
        }
    };

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
                    <AlertCircle className="mr-2" size={20} />
                    {error}
                </div>
            )}

            <div className="flex justify-between items-center">
                <div className="flex space-x-4 flex-1">
                    <div className="relative flex-1">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search exercises..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-md w-full"
                        />
                    </div>
                    <select
                        value={selectedMuscle}
                        onChange={(e) => setSelectedMuscle(e.target.value)}
                        className="border rounded-md px-3 py-2"
                    >
                        <option value="all">All Muscles</option>
                        {muscleGroups.map((muscle) => (
                            <option key={muscle} value={muscle}>
                                {muscle.charAt(0).toUpperCase() +
                                    muscle.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    <Plus size={20} className="mr-2" />
                    Add Exercise
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">
                                    {editingExercise
                                        ? "Edit Exercise"
                                        : "Add New Exercise"}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingExercise(null);
                                        setForm({
                                            name: "",
                                            force: "",
                                            level: "",
                                            mechanic: "",
                                            equipment: "",
                                            primaryMuscles: [],
                                            secondaryMuscles: [],
                                            instructions: [],
                                            category: "",
                                        });
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Exercise Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Level
                                        </label>
                                        <select
                                            name="level"
                                            value={form.level}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-md"
                                        >
                                            <option value="">
                                                Select Level
                                            </option>
                                            {levels.map((level) => (
                                                <option
                                                    key={level}
                                                    value={level}
                                                >
                                                    {level
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        level.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Category
                                        </label>
                                        <select
                                            name="category"
                                            value={form.category}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-md"
                                        >
                                            <option value="">
                                                Select Category
                                            </option>
                                            {categories.map((category) => (
                                                <option
                                                    key={category}
                                                    value={category}
                                                >
                                                    {category
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        category.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Force
                                        </label>
                                        <select
                                            name="force"
                                            value={form.force}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-md"
                                        >
                                            <option value="">
                                                Select Force
                                            </option>
                                            {forces.map((force) => (
                                                <option
                                                    key={force}
                                                    value={force}
                                                >
                                                    {force
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        force.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mechanic
                                        </label>
                                        <select
                                            name="mechanic"
                                            value={form.mechanic}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-md"
                                        >
                                            <option value="">
                                                Select Mechanic
                                            </option>
                                            {mechanics.map((mechanic) => (
                                                <option
                                                    key={mechanic}
                                                    value={mechanic}
                                                >
                                                    {mechanic
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        mechanic.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Primary Muscles
                                        </label>
                                        <select
                                            name="primaryMuscles"
                                            multiple
                                            value={form.primaryMuscles}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-md h-32"
                                        >
                                            {muscleGroups.map((muscle) => (
                                                <option
                                                    key={muscle}
                                                    value={muscle}
                                                >
                                                    {muscle
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        muscle.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Secondary Muscles
                                        </label>
                                        <select
                                            name="secondaryMuscles"
                                            multiple
                                            value={form.secondaryMuscles}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-md h-32"
                                        >
                                            {muscleGroups.map((muscle) => (
                                                <option
                                                    key={muscle}
                                                    value={muscle}
                                                >
                                                    {muscle
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        muscle.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Equipment
                                    </label>
                                    <input
                                        type="text"
                                        name="equipment"
                                        value={form.equipment}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Instructions (one per line)
                                    </label>
                                    <textarea
                                        name="instructions"
                                        value={form.instructions.join("\n")}
                                        onChange={handleInputChange}
                                        rows={5}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingExercise(null);
                                        }}
                                        className="px-4 py-2 border rounded-md hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                                    >
                                        {loading
                                            ? "Saving..."
                                            : "Save Exercise"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExercises.map((exercise) => (
                    <div
                        key={exercise?._id}
                        className="bg-white p-6 rounded-lg shadow"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold">
                                    {exercise?.name || "Unnamed Exercise"}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Level: {exercise?.level || "Not specified"}
                                </p>
                                <div className="mt-2 space-y-1">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">
                                            Category:
                                        </span>{" "}
                                        {exercise?.category || "Not specified"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">
                                            Force:
                                        </span>{" "}
                                        {exercise?.force || "Not specified"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">
                                            Equipment:
                                        </span>{" "}
                                        {exercise?.equipment || "Not specified"}
                                    </p>
                                    {exercise?.primaryMuscles?.length > 0 && (
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">
                                                Primary Muscles:
                                            </span>{" "}
                                            {exercise.primaryMuscles.join(", ")}
                                        </p>
                                    )}
                                    {exercise?.secondaryMuscles?.length > 0 && (
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">
                                                Secondary Muscles:
                                            </span>{" "}
                                            {exercise.secondaryMuscles.join(
                                                ", "
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                onClick={() => handleEdit(exercise)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                title="Edit exercise"
                            >
                                <Pencil size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(exercise?._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                title="Delete exercise"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        {exercise?.instructions?.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                                <p className="font-medium text-sm text-gray-700 mb-2">
                                    Instructions:
                                </p>
                                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                                    {exercise.instructions.map(
                                        (instruction, idx) => (
                                            <li key={idx} className="text-sm">
                                                {instruction}
                                            </li>
                                        )
                                    )}
                                </ol>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {loading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}

            {!loading && filteredExercises.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No exercises found.{" "}
                    {searchTerm && "Try adjusting your search criteria."}
                </div>
            )}
        </div>
    );
};

export default ManageExercises;
