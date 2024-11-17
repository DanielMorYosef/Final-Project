import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BarChart2, Users, Dumbbell } from "lucide-react";
import Footer from "./Footer";
import "../styles//button.css";

const Home = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Dumbbell className="w-12 h-12" />,
            title: "500+ Exercises",
            description:
                "Access our comprehensive database of exercises with detailed instructions and form guides.",
        },
        {
            icon: <BarChart2 className="w-12 h-12" />,
            title: "Progress Tracking",
            description:
                "Monitor your gains with intuitive charts and detailed workout history.",
        },
        {
            icon: <Users className="w-12 h-12" />,
            title: "Custom Workouts",
            description:
                "Create and save personalized workout routines tailored to your goals.",
        },
    ];

    return (
        <div className="min-h-screen text-white">
            <div className="relative h-screen">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: "url(/photos/homepagephoto.jpg)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 h-full">
                    <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col justify-center h-full">
                            <div className="max-w-3xl">
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
                                    <span className="block text-white mb-2">
                                        Transform your fitness journey with
                                    </span>
                                    <span className="block text-blue-400">
                                        smart tracking
                                    </span>
                                </h1>
                                <p className="mt-6 text-lg sm:text-xl text-gray-100 font-bold max-w-2xl">
                                    Take control of your workouts with our
                                    intelligent tracking system. Monitor
                                    progress, create custom routines, and
                                    achieve your fitness goals faster than ever.
                                </p>
                                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => navigate("/register")}
                                        className="flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Get Started
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => navigate("/login")}
                                        className="flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        Sign In
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base text-blue-500 font-semibold tracking-wide uppercase">
                            Features
                        </h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                            Everything you need to succeed
                        </p>
                    </div>

                    <div className="mt-20">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature, index) => (
                                <div key={index} className="pt-6">
                                    <div className="flow-root bg-gray-800 rounded-lg px-6 pb-8">
                                        <div className="-mt-6">
                                            <div>
                                                <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                                                    {feature.icon}
                                                </span>
                                            </div>
                                            <h3 className="mt-8 text-lg font-medium text-white tracking-tight">
                                                {feature.title}
                                            </h3>
                                            <p className="mt-5 text-base text-gray-400">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-blue-600">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            <span className="block">
                                Ready to start your journey?
                            </span>
                            <span className="block text-blue-200">
                                Join us today and transform your workouts.
                            </span>
                        </h2>
                        <div className="mt-8 flex justify-center lg:justify-start lg:mt-0 lg:flex-shrink-0">
                            <div className="inline-flex rounded-md shadow">
                                <button
                                    onClick={() => navigate("/register")}
                                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                                >
                                    Get started
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
