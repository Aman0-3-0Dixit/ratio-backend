const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter your name."],
    min: [3, "Your name must be greater than 3 characters."],
    max: [20, "Your name must be lesser than 20 characters."],
  },
  email: {
    type: String,
    required: [true, "Please enter your email address."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email address."],
  },
  password: {
    type: String,
    required: [true, "Please enter your password."],
    minLength: 8,
    select: false,
  },
  images: {
    type: [String],
    required: true,
  },
  interests: {
    type: [String],
    required: [true, "Please enter your interests."],
  },
  gender: {
    type: String,
    enum: ["male", "female", "prefer not to say"],
    required: [true, "Please enter your gender."],
  },
  connect_with: {
    type: String,
    enum: ["male", "female", "both"],
    required: [true, "Please enter the gender you want to connect with."],
  },
  spotify_song: {
    type: String,
    required: [true, "Please enter your favourite song!"],
  },
  fav_cuisine: {
    type: String,
    required: [true, "Please enter your favourite cuisine!"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
