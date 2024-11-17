import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../utils/ToastContext";
import LoadingSpinner from "./LoadingSpinner";

const Login = () => {
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
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
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/login`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            const token = response.data;
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = token;
            addToast("Successfully logged in!", "success");
            navigate("/dashboard");
        } catch (err) {
            if (err.response) {
                if (err.response.status === 403) {
                    setError("Invalid email or password. Please try again.");
                    addToast(err.response?.data || "Login failed", "error");
                } else {
                    setError(
                        "Login failed. Please check your credentials and try again."
                    );
                    addToast(err.response?.data || "Login failed", "error");
                }
            } else if (err.request) {
                setError(
                    "Unable to connect to the server. Please check your internet connection."
                );
                addToast(err.response?.data || "Login failed", "error");
            } else {
                setError(
                    "An unexpected error occurred. Please try again later."
                );
                addToast(err.response?.data || "Login failed", "error");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative">
            <button
                onClick={() => navigate("/")}
                className="button-62 absolute top-4 left-4"
                style={{ padding: "8px 16px" }}
            >
                ← Back to Home
            </button>

            <div className="max-w-md w-full space-y-8 p-8 bg-gray-900 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">
                        Sign in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="text-red-500 text-center p-2 bg-red-100 rounded">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4">
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
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="button-62 w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? <LoadingSpinner /> : "Sign in"}
                        </button>
                    </div>
                </form>
                <div className="text-center text-white">
                    <p>
                        Don't have an account?{" "}
                        <a
                            href="/register"
                            className="text-blue-500 hover:text-blue-600"
                        >
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
