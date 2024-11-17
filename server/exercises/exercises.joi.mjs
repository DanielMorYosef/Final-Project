import Joi from "joi";

const exerciseJoiSchema = Joi.object({
    name: Joi.string().required(),
    force: Joi.string().allow(null, "").optional(),
    level: Joi.string().allow(null, "").optional(),
    mechanic: Joi.string().allow(null, "").optional(),
    equipment: Joi.string().allow(null, "").optional(),
    primaryMuscles: Joi.array().items(Joi.string()).default([]),
    secondaryMuscles: Joi.array().items(Joi.string()).default([]),
    instructions: Joi.array().items(Joi.string()).default([]),
    category: Joi.string().allow(null, "").optional(),
}).options({ stripUnknown: true });

export const validateExercise = (exerciseData) => {
    return exerciseJoiSchema.validate(exerciseData, { abortEarly: false });
};
