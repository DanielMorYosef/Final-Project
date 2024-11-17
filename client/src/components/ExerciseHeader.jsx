import React, { useState } from "react";
import { Info } from "lucide-react";
import ExerciseDetailModal from "./ExerciseDetailModal";

const ExerciseHeader = ({ exercise, onRemove }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const exerciseName = exercise.name || exercise.exercise?.name;

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="font-medium">{exerciseName}</h3>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                        title="View exercise details"
                    >
                        <Info size={16} />
                    </button>
                </div>
            </div>

            <ExerciseDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                exerciseName={exerciseName}
            />
        </>
    );
};

export default ExerciseHeader;
