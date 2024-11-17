import Joi from "joi";

const setSchema = Joi.object({
    reps: Joi.number().default(0).min(0),
    weight: Joi.number().default(0).min(0),
}).unknown(true);

const exerciseLogSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Exercise name cannot be empty",
        "any.required": "Exercise name is required",
    }),
    sets: Joi.array().items(setSchema).min(1).required().messages({
        "array.base": "Sets must be an array",
        "array.min": "At least one set is required",
        "any.required": "Sets are required",
    }),
    notes: Joi.string().allow("").optional(),
}).unknown(true);

export const workoutLogJoiSchema = Joi.object({
    workoutId: Joi.string().required().messages({
        "string.empty": "Workout ID cannot be empty",
        "any.required": "Workout ID is required",
    }),
    workoutName: Joi.string().required().messages({
        "string.empty": "Workout name cannot be empty",
        "any.required": "Workout name is required",
    }),
    startTime: Joi.date().required().messages({
        "date.base": "Start time must be a valid date",
        "any.required": "Start time is required",
    }),
    endTime: Joi.date().required().messages({
        "date.base": "End time must be a valid date",
        "any.required": "End time is required",
    }),
    duration: Joi.number().min(0).required().messages({
        "number.base": "Duration must be a number",
        "number.min": "Duration cannot be negative",
        "any.required": "Duration is required",
    }),
    exercises: Joi.array().items(exerciseLogSchema).min(1).required().messages({
        "array.base": "Exercises must be an array",
        "array.min": "At least one exercise is required",
        "any.required": "Exercises are required",
    }),
}).unknown(true);

export const validateWorkoutLog = (workoutLogData) => {
    return workoutLogJoiSchema.validate(workoutLogData, {
        abortEarly: false,
        stripUnknown: false,
    });
};
