const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const prefSettings = require("../models/prefSettingsModel.js");
const Report = require("../models/reportsModel.js");
const NotificationSettings = require("../models/notificationModel.js");
const UserSettings = require("../models/settingsModel.js");
const { sendVerificationMail } = require("../utils/mail/mail.js");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    status: "success",
    results: users.length,
    users,
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  res.status(200).json({
    status: "success",
    user,
  });
});

exports.getWelcomePageDetails = catchAsync(async (req, res, next) => {
  const id = req.body.id;
  const user = await User.findById(id).select("username age bio city");
  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  res.status(200).json({
    status: "success",
    user,
  });
});

exports.connectWith = catchAsync(async (req, res, next) => {
  const { id, connect_with } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    {
      connect_with,
    },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    user,
  });
});

exports.likeAUser = catchAsync(async (req, res, next) => {
  const { id, likeId } = req.body;

  // Update the user who is liking
  const userLiking = await User.findByIdAndUpdate(
    id,
    { $addToSet: { liked_by_me: likeId } }, // Use $addToSet to avoid adding duplicate IDs
    { new: true }
  ).select("name");

  // Update the user who is being liked
  const userLiked = await User.findByIdAndUpdate(
    likeId,
    { $addToSet: { others_liked: id } }, // Use $addToSet to avoid adding duplicate IDs
    { new: true }
  ).select("name");

  res.status(200).json({
    status: "success",
    userLiked,
    userLiking,
  });
});

exports.likedByOthers = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  const usersLiked = await User.findOne({ _id: id })
    .select("others_liked")
    .populate({
      path: "others_liked",
      select: "name",
    });

  if (!usersLiked) {
    return next(
      new AppError("Something went wrong.Please try again later.", 500)
    );
  }

  res.status(200).json({
    status: "success",
    usersLiked,
  });
});

exports.userPreferenceSettings = catchAsync(async (req, res, next) => {
  const { id, ...prefSettingsData } = req.body;

  const newPrefSettings = await prefSettings.create(prefSettingsData);
  const user = await User.findByIdAndUpdate(
    id,
    { prefSettings: newPrefSettings._id },
    { new: true, runValidators: true }
  );

  if (!user) return next(new AppError("No user found with that Id.", 404));

  res.status(201).json({
    status: "success",
    user,
  });
});

exports.getUserProfile1 = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  const user = await User.findById(id).select(
    "name age bio city interests fav_cuisine spotify_song spotify_song_reason education profession social_media ethnicity"
  );

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  res.status(200).json({
    status: "success",
    user,
  });
});

exports.getUserProfile2 = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  const user = await User.findById(id).select(
    "name age bio city good_life_quote win_life_quote"
  );

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  res.status(200).json({
    status: "success",
    user,
  });
});

exports.reportUser = catchAsync(async (req, res, next) => {
  const { id, ...reportData } = req.body;
  const user = await User.findById(id);

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  const report = await Report.create(reportData);
  if (!report)
    return next(new AppError("Something went wrong. Please try again.", 500));

  await User.findByIdAndUpdate(id, { $push: { reports: report._id } });

  res.status(200).json({
    status: "success",
    user,
  });
});

exports.createNotificationSettings = catchAsync(async (req, res, next) => {
  const { id, ...notificationData } = req.body;
  const user = await User.findById(id);

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  const notificationSettings = await NotificationSettings.create(
    notificationData
  );

  if (!notificationSettings) {
    return next(new AppError("Something went wrong. Please try again.", 500));
  }

  await User.findByIdAndUpdate(id, {
    notifications: notificationSettings._id,
  });

  res.status(200).json({
    status: "success",
    user,
  });
});

exports.updateNotificationSettings = catchAsync(async (req, res, next) => {
  const { id, ...notificationData } = req.body;
  const user = await User.findById(id);
  const notificationSettings = await NotificationSettings.findOneAndUpdate(
    { _id: user.notifications },
    { ...notificationData },
    { new: true }
  );

  if (!notificationSettings) {
    return next(new AppError("Something went wrong. Please try again.", 500));
  }

  res.status(200).json({
    status: "success",
    notificationSettings,
  });
});

exports.createSettings = catchAsync(async (req, res, next) => {
  const { id, ...settingsData } = req.body;
  const user = await User.findById(id);

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  const settings = await UserSettings.create(settingsData);

  if (!settings) {
    return next(new AppError("Something went wrong. Please try again.", 500));
  }

  await User.findByIdAndUpdate(id, {
    settings: settings._id,
  });

  res.status(200).json({
    status: "success",
    user,
  });
});

exports.updateSettings = catchAsync(async (req, res, next) => {
  const { id, ...settingsData } = req.body;
  const user = await User.findById(id);

  const settings = await UserSettings.findOneAndUpdate(
    { _id: user.settings },
    { ...settingsData },
    { new: true }
  );

  if (!settings) {
    return next(new AppError("Something went wrong. Please try again.", 500));
  }

  res.status(200).json({
    status: "success",
    settings,
  });
});

exports.verifyMe = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    return next(
      new AppError("This email is already taken by another user.", 403)
    );
  }

  const link = "http://localhost:3000/verify";

  await sendVerificationMail({ email, link });

  res.status(200).json({
    status: "success",
    message: "Please check you email for verification link.",
  });
});
