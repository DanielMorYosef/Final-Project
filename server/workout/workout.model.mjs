import mongoose, { Schema } from "mongoose";

const exerciseInWorkoutSchema = new Schema({
    exercise: {
        type: Schema.Types.ObjectId,
        ref: "Exercise",
        required: true,
    },
    sets: [
        {
            reps: Number,
            weight: Number,
            completed: {
                type: Boolean,
                default: false,
            },
        },
    ],
    notes: String,
});

const workoutSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    exercises: [exerciseInWorkoutSchema],
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isFavorite: {
        type: Boolean,
        default: false,
    },
    lastPerformed: Date,
    estimatedDuration: Number,
    exerciseCount: {
        type: Number,
        default: function () {
            return this.exercises.length;
        },
    },
    category: {
        type: String,
        enum: [
            "strength",
            "cardio",
            "flexibility",
            "full-body",
            "upper-body",
            "lower-body",
        ],
        default: "strength",
    },
    difficulty: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "intermediate",
    },
    isFavorite: {
        type: Boolean,
        default: false,
    },
});

export const Workout = mongoose.model("Workout", workoutSchema);
