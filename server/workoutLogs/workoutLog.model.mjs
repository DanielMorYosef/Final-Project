import mongoose, { Schema } from "mongoose";

const setSchema = new Schema({
    reps: {
        type: Number,
        required: true,
        min: 0,
    },
    weight: {
        type: Number,
        required: true,
        min: 0,
    },
});

const exerciseLogSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    sets: [setSchema],
    notes: String,
});

const workoutLogSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    workoutId: {
        type: String,
        required: true,
    },
    workoutName: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    exercises: [exerciseLogSchema],
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const WorkoutLog = mongoose.model("WorkoutLog", workoutLogSchema);
