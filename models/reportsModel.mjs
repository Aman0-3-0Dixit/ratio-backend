import mongoose from "mongoose"

const reportSchema = new mongoose.Schema({
  reason: {
    type: String,
    enum: [
      "Inappropriate content",
      "Underage or minor",
      "Someone is in danger",
      "Profile looks either fake or bot",
      "Nudity or sexual explicit",
      "Hateful or abusive content",
    ],
    required: [true, "Please select a reason for reporting."],
  },
  details: {
    type: String,
    required: [true, "Please provide details for the report."],
  },
  sub_details: {
    type: String,
    required: [true, "Please provide sub details for the report."],
  },
  reported_at: {
    type: Date,
    default: Date.now,
  },
  reported_against: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide the user you want to report."],
  },
});

const Report = mongoose.model("Report", reportSchema);
export default Report