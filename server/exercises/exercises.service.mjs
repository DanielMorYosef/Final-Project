import { Exercise } from "./exercises.model.mjs";
import { exercise as data } from "./exercisesInitialData.mjs";

(async () => {
    function strengthExercises() {
        return data.exercises.filter(
            (exercise) => exercise.category === "strength"
        );
    }

    const exerciseAmount = await Exercise.find().countDocuments();

    if (exerciseAmount === 0) {
        for (const e of strengthExercises()) {
            const exercise = new Exercise(e);
            await exercise.save();
        }
        console.log("Initial exercises data has been added to the database.");
    }
})();
