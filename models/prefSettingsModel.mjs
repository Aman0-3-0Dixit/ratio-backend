import mongoose from "mongoose"
import { Schema, model } from 'mongoose';

const prefSettingsSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  distance: {
    min_distance: {
      type: Number,
      required: [true, "Please enter the minimum distance."],
      min: [1, "Minimum distance must be greater than 1."],
    },
    max_distance: {
      type: Number,
      required: [true, "Please enter the maximum distance."],
      max: [100, "Maximum distance must be less than or equal to 100."],
    },
  },
  age: {
    min_age: {
      type: Number,
      min: [18, "Your preferred age must be greater than 18."],
    },
    max_age: {
      type: Number,
      max: [80, "Your preferred age must be less than 80."],
    },
  },
  applyDistanceFilter: {
    type: Boolean,
    default: false,
  },
  applyAgeFilter: {
    type: Boolean,
    default: false,
  },
  verifiedFilter: {
    type: Boolean,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Transgender Female", "Transgender Male", "Non-conforming","Others"],
    required: [true, "Please enter your gender."],
  },
  genderToShow: {
      type: String,
      enum: ["Male", "Female", "Both"],
      required: [true, "Please enter your gender."],
    },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const prefSettings = mongoose.model("prefSettings", prefSettingsSchema);

// module.exports = prefSettings;
export default prefSettings
