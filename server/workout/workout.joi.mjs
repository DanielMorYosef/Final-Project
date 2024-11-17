import Joi from "joi";

export const workoutJoiSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(""),
    exercises: Joi.array().items(
        Joi.object({
            exercise: Joi.string().required(),
            sets: Joi.array().items(
                Joi.object({
                    reps: Joi.number().required(),
                    weight: Joi.number().required(),
                    completed: Joi.boolean(),
                })
            ),
            notes: Joi.string().allow(""),
        })
    ),
    estimatedDuration: Joi.number(),
});

export const validateWorkout = (workoutData) => {
    return workoutJoiSchema.validate(workoutData, { abortEarly: false });
};
