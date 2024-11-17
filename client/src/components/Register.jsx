import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/signup`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            navigate("/login");
        } catch (err) {
            setError(
                err.response?.data || "An error occurred during registration"
            );
        } finally {
            setIsLoading(false);
        }
    };
    if (isLoading) {
        <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative">
            <div>
                <button
                    onClick={() => navigate("/")}
                    className="button-62 sm:top-2 absolute top-4 left-4"
                    style={{ padding: "8px 16px" }}
                >
                    ← Back to Home
                </button>
            </div>
            <div className="max-w-md w-full space-y-8 p-8 bg-gray-900 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">
                        Create your account
                    </h2>
                    <p className="mt-2 text-gray-300">
                        Start your fitness journey today
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="text-red-500 text-center p-2 bg-red-100 rounded">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="firstName"
                                    className="text-white"
                                >
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border rounded-md text-black"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="lastName"
                                    className="text-white"
                                >
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border rounded-md text-black"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="text-white">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full px-3 py-2 border rounded-md text-black"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="text-white">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full px-3 py-2 border rounded-md text-black"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            <p className="mt-1 text-sm text-gray-400">
                                Password must contain at least 9 characters,
                                including uppercase, lowercase, number and
                                special character
                            </p>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="button-62 w-full"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>
                    </div>
                </form>
                <div className="text-center text-white">
                    <p>
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="text-blue-500 hover:text-blue-600"
                        >
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
