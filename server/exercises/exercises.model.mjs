import mongoose, { Schema } from "mongoose";

const exerciseSchema = new Schema({
  name: String,
  force: String,
  level: String,
  mechanic: String,
  equipment: String,
  primaryMuscles: [],
  secondaryMuscles: [],
  instructions: [],
  category: String,
});

export const Exercise = mongoose.model("Exercise", exerciseSchema);
