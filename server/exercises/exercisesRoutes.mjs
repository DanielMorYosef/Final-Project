import { app } from "../app.mjs";
import { adminGuard, getUser, guard } from "../guard.mjs";
import { Exercise } from "./exercises.model.mjs";
import { validateExercise } from "./exercises.joi.mjs";

// Get all exercises
app.get("/exercises", guard, async (req, res) => {
    res.send(await Exercise.find());
});

// Get exercise by id
app.get("/exercises/:id", adminGuard, async (req, res) => {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
        return res.status(404).send();
    }
    res.send(exercise);
});

// Create exercise (admin only)
app.post("/exercises", adminGuard, async (req, res) => {
    try {
        const { error, value } = validateExercise(req.body);

        if (error) {
            return res.status(400).send({
                errors: error.details.map((detail) => detail.message),
            });
        }

        const exercise = new Exercise(value);
        const savedExercise = await exercise.save();
        res.status(201).send(savedExercise);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Delete exercise (admin only)
app.delete("/exercises/:id", adminGuard, async (req, res) => {
    try {
        const exercise = await Exercise.findByIdAndDelete(req.params.id);

        if (!exercise) {
            return res.status(404).send();
        }

        res.send({ message: "Exercise deleted successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Update exercise (admin only)
app.put("/exercises/:id", adminGuard, async (req, res) => {
    try {
        const exerciseData = {
            name: req.body.name,
            force: req.body.force || null,
            level: req.body.level || null,
            mechanic: req.body.mechanic || null,
            equipment: req.body.equipment || null,
            primaryMuscles: Array.isArray(req.body.primaryMuscles)
                ? req.body.primaryMuscles
                : [],
            secondaryMuscles: Array.isArray(req.body.secondaryMuscles)
                ? req.body.secondaryMuscles
                : [],
            instructions: Array.isArray(req.body.instructions)
                ? req.body.instructions
                : [],
            category: req.body.category || null,
        };

        const { error, value } = validateExercise(exerciseData);

        if (error) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.details.map((detail) => detail.message),
            });
        }

        const exercise = await Exercise.findByIdAndUpdate(
            req.params.id,
            { $set: value },
            { new: true, runValidators: true }
        );

        if (!exercise) {
            return res.status(404).json({ message: "Exercise not found" });
        }

        res.json(exercise);
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({
            message: "Failed to update exercise",
            error: error.message,
        });
    }
});
