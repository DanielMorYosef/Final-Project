import { app } from "../app.mjs";
import { guard } from "../guard.mjs";
import { Workout } from "./workout.model.mjs";
import { validateWorkout } from "./workout.joi.mjs";
import { WorkoutLog } from "../workoutLogs/workoutLog.model.mjs";
import jwt from "jsonwebtoken";

// Create new workout
app.post("/workouts", guard, async (req, res) => {
    try {
        const { error, value } = validateWorkout(req.body);

        if (error) {
            return res.status(400).send({
                errors: error.details.map((detail) => detail.message),
            });
        }

        const user = jwt.decode(req.headers.authorization);

        const workout = new Workout({
            ...value,
            userId: user._id,
        });

        const savedWorkout = await workout.save();
        res.status(201).send(savedWorkout);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get user's workouts
app.get("/workouts", guard, async (req, res) => {
    try {
        const user = jwt.decode(req.headers.authorization);
        const workouts = await Workout.find({ userId: user._id })
            .populate({
                path: "exercises.exercise",
                model: "Exercise",
                select: "name category primaryMuscles",
            })
            .sort({ createdAt: -1 });

        const transformedWorkouts = workouts.map((workout) => {
            return {
                ...workout.toObject(),
                exercises: workout.exercises.map((ex) => ({
                    ...ex,
                    name: ex.exercise?.name || "Unknown Exercise",
                    sets: ex.sets,
                    notes: ex.notes,
                })),
            };
        });

        res.json(transformedWorkouts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single workout with populated exercise data
app.get("/workouts/:id", guard, async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id).populate({
            path: "exercises.exercise",
            model: "Exercise",
            select: "name category primaryMuscles",
        });

        if (!workout) {
            return res.status(404).send();
        }

        const transformedWorkout = {
            ...workout.toObject(),
            exercises: workout.exercises.map((ex) => ({
                ...ex,
                name: ex.exercise?.name || "Unknown Exercise",
                sets: ex.sets,
                notes: ex.notes,
            })),
        };

        res.json(transformedWorkout);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update workout
app.put("/workouts/:id", guard, async (req, res) => {
    try {
        const { error, value } = validateWorkout(req.body);

        if (error) {
            return res.status(400).send({
                errors: error.details.map((detail) => detail.message),
            });
        }

        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).send();
        }

        const user = jwt.decode(req.headers.authorization);

        if (workout.userId.toString() !== user._id) {
            return res.status(403).send("Not authorized to edit this workout");
        }

        Object.assign(workout, value);
        await workout.save();

        res.send(workout);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Delete workout
app.delete("/workouts/:id", guard, async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).send("Workout not found");
        }

        const user = jwt.decode(req.headers.authorization);

        if (workout.userId.toString() !== user._id) {
            return res
                .status(403)
                .send("Not authorized to delete this workout");
        }

        await Workout.findByIdAndDelete(req.params.id);

        await WorkoutLog.deleteMany({ workoutId: req.params.id });

        res.send({
            message: "Workout and associated logs deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting workout:", error);
        res.status(500).send({ error: error.message });
    }
});

// Toggle favorite status
app.patch("/workouts/:id/favorite", guard, async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).send();
        }

        const user = jwt.decode(req.headers.authorization);

        if (workout.userId.toString() !== user._id) {
            return res.status(403).send("Not authorized");
        }

        workout.isFavorite = !workout.isFavorite;
        await workout.save();

        res.send(workout);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});
