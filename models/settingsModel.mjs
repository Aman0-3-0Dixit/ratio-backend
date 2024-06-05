import mongoose from "mongoose"
import validator from "validator"

const userSettingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  phone_number: {
    type: String,
    required: [true, "Please enter your phone number."],
    unique: true,
    validate: [validator.isMobilePhone, "Please enter a valid phone number."],
  },
  email: {
    type: String,
    required: [true, "Please enter your email address."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email address."],
  },
  communityGuidelinesAccepted: {
    type: Boolean,
    default: false,
  },
  accountStatus: {
    type: String,
    enum: ["active", "inactive", "deleted"],
    default: "active",
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

const UserSettings = mongoose.model("UserSettings", userSettingsSchema);
export default UserSettings;
