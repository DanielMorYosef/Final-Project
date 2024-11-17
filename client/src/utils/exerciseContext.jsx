import React, { createContext, useContext, useState } from "react";

const ExerciseContext = createContext();

export const ExerciseProvider = ({ children }) => {
    const [exercises, setExercises] = useState([]);

    const updateExercises = (newExercises) => {
        setExercises(newExercises);
    };

    return (
        <ExerciseContext.Provider value={{ exercises, updateExercises }}>
            {children}
        </ExerciseContext.Provider>
    );
};

export const useExercises = () => {
    const context = useContext(ExerciseContext);
    if (!context) {
        throw new Error("useExercises must be used within an ExerciseProvider");
    }
    return context;
};
