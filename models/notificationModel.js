const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  allNotifications: {
    type: Boolean,
    default: false,
  },
  newMatches: {
    type: Boolean,
    default: false,
  },
  newMessages: {
    type: Boolean,
    default: false,
  },
  newLikes: {
    type: Boolean,
    default: false,
  },
  announcementsOnRatio: {
    type: Boolean,
    default: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const NotificationSettings = mongoose.model(
  "NotificationSettings",
  notificationSchema
);

module.exports = NotificationSettings;
