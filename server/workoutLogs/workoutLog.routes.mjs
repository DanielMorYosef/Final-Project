import { app } from "../app.mjs";
import { guard } from "../guard.mjs";
import { WorkoutLog } from "./workoutLog.model.mjs";
import { validateWorkoutLog } from "./workoutLog.joi.mjs";
import jwt from "jsonwebtoken";

// Create workout log
app.post("/workout-logs", guard, async (req, res) => {
    try {
        const { error, value } = validateWorkoutLog(req.body);

        if (error) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.details.map((detail) => ({
                    message: detail.message,
                    path: detail.path,
                })),
            });
        }

        const user = jwt.decode(req.headers.authorization);

        const workoutLog = new WorkoutLog({
            ...value,
            userId: user._id,
        });

        const savedWorkoutLog = await workoutLog.save();
        res.status(201).json(savedWorkoutLog);
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get recent workouts
app.get("/workout-logs/recent", guard, async (req, res) => {
    try {
        const user = jwt.decode(req.headers.authorization);
        const recentWorkouts = await WorkoutLog.find({ userId: user._id })
            .sort({ startTime: -1 })
            .limit(6);

        res.json(recentWorkouts);
    } catch (error) {
        console.error("Error fetching recent workouts:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get workouts by date
app.get("/workout-logs/date/:date", guard, async (req, res) => {
    try {
        const user = jwt.decode(req.headers.authorization);
        const searchDate = new Date(req.params.date);

        const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

        const workouts = await WorkoutLog.find({
            userId: user._id,
            startTime: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        }).sort({ startTime: 1 });

        res.json(workouts);
    } catch (error) {
        console.error("Error fetching workouts by date:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get user's workout logs
app.get("/workout-logs", guard, async (req, res) => {
    try {
        const user = jwt.decode(req.headers.authorization);
        const { page = 1, limit = 10, startDate, endDate } = req.query;

        let query = { userId: user._id };

        if (startDate || endDate) {
            query.startTime = {};
            if (startDate) query.startTime.$gte = new Date(startDate);
            if (endDate) query.startTime.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const workoutLogs = await WorkoutLog.find(query)
            .sort({ startTime: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await WorkoutLog.countDocuments(query);

        res.json({
            workoutLogs,
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single workout log
app.get("/workout-logs/:id", guard, async (req, res) => {
    try {
        const workoutLog = await WorkoutLog.findById(req.params.id);

        if (!workoutLog) {
            return res.status(404).json({ message: "Workout log not found" });
        }

        const user = jwt.decode(req.headers.authorization);

        if (workoutLog.userId.toString() !== user._id) {
            return res
                .status(403)
                .json({ message: "Not authorized to view this workout log" });
        }

        res.json(workoutLog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete workout log
app.delete("/workout-logs/:id", guard, async (req, res) => {
    try {
        const workoutLog = await WorkoutLog.findById(req.params.id);

        if (!workoutLog) {
            return res.status(404).json({ message: "Workout log not found" });
        }

        const user = jwt.decode(req.headers.authorization);

        if (workoutLog.userId.toString() !== user._id) {
            return res
                .status(403)
                .json({ message: "Not authorized to delete this workout log" });
        }

        await WorkoutLog.findByIdAndDelete(req.params.id);
        res.json({ message: "Workout log deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
