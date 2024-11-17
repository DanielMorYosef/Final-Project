import React from "react";
import { Mail } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col justify-center items-center  gap-3">
                        <img
                            src="/photos/logo.png"
                            alt="Workout Tracker"
                            className="h-12 w-auto"
                        />
                        <p className="text-sm md:text-base text-gray-400 text-center md:text-left">
                            Making the world a stronger place,
                            <br className="hidden md:inline" /> one workout at a
                            time.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-3 text-gray-400">
                        <a
                            href="mailto:danielmoryosefwebdev@gmail.com"
                            className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200"
                        >
                            <Mail className="h-5 w-5" />
                            <span className="text-sm md:text-base">
                                DanielmoryosefWebDev@gmail.com
                            </span>
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800">
                    <p className="text-sm text-center text-gray-400">
                        &copy; {new Date().getFullYear()} Workout Tracker. All
                        rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
