const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
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
  city: {
    type: String,
    required: [true, "Please enter your city."],
  },
  age: {
    type: Number,
    required: [true, "Please enter your age."],
    min: [12, "Your age must be greater than 12."],
  },
  others_liked: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
  liked_by_me: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
  bio: {
    type: String,
    required: [true, "Please enter your bio."],
    min: [50, "Your bio must be atleast 50 words."],
    min: [200, "Your bio must be atmost 200 words."],
  },
  password: {
    type: String,
    required: [true, "Please enter your password."],
    minLength: 8,
    select: false,
  },
  images: {
    type: [String],
  },
  interests: {
    type: [String],
    required: [true, "Please enter your interests."],
  },
  education: {
    type: String,
    required: [true, "Please enter your education."],
  },
  profession: {
    type: String,
    required: [true, "Please enter your profession."],
  },
  social_media: {
    type: String,
    required: [true, "Please enter your social media handle."],
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

  spotify_song_reason: {
    type: String,
    required: [true, "Please enter the reason for your favourite song!"],
  },
  fav_cuisine: {
    type: String,
    required: [true, "Please enter your favourite cuisine!"],
  },
  ethnicity: {
    type: String,
    required: [true, "Please enter your ethnicity!"],
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  prefSettings: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "prefSettings",
  },
  settings: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserSettings",
  },
  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
  ],
  good_life_quote: {
    type: String,
    required: [true, "Please enter your good life quote!"],
    min: [20, "Your good life quote must be atleast 20 letters."],
    max: [200, "Your good life quote must be atmost 200 letters."],
  },
  win_heart_quote: {
    type: String,
    required: [true, "Please enter your win  heart quote!"],
    min: [20, "Your win  heart quote must be atleast 20 letters."],
    max: [200, "Your win  heart quote must be atmost 200 letters."],
  },
  notifications: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NotificationSettings",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
