import catchAsync from "../utils/catchAsync.mjs"
import User from "../models/userModel.mjs"
import userInfoSchema from "../models/userInfo.mjs"
import AppError from "../utils/appError.mjs"
import prefSettings from "../models/prefSettingsModel.mjs"
import Report from "../models/reportsModel.mjs"
import NotificationSettings from "../models/notificationModel.mjs"
import UserSettings from "../models/settingsModel.mjs"
import { sendVerificationMail } from "../utils/mail/mail.js"

export async function getAllUsers (req,res){
  const users = await User.find({});
  res.status(200).json({
    status: "success",
    results: users.length,
    users,
  });
};

export async function getUserById  (req,res) {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  res.status(200).json({
    status: "success",
    user,
  });
};

export async function getUserInfosById (req,res) {
    console.log("getUserInfosById", req.params);

    const idsList = req.params.customIds.split(',');
    console.log(idsList);
    const userInfo = await userInfoSchema.find({
                                 '_id': { $in: idsList }
                             }).select('_id firstName images');

    if (userInfo) {
      console.log(userInfo.length);
      res.json(userInfo);
    } else {
      res.status(404).send('Item not found');
    }
}


export async function getUserInfoById (req,res) {
    const id = req.params.customId;
    console.log(id);
    const userInfo = await userInfoSchema.findOne({'_id': id});
    console.log(userInfo);
    if (userInfo) {
      console.log(userInfo.length);
      res.json(userInfo);
    } else {
      res.status(404).send('Item not found');
    }
}


export async function getWelcomePageDetails  (req,res) {
  const id = req.body.id;
  const user = await User.findById(id).select("username age bio city");
  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  res.status(200).json({
    status: "success",
    user,
  });
};

export async function connectWith  (req,res) {
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
};

export async function likeAUser  (req,res) {
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
};

export async function likedByOthers  (req,res) {
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
};

export async function userPreferenceSettings  (req,res) {
  const { id, prefSettingsData } = req.body;
  console.log(prefSettingsData);
  const newPrefSettings = await prefSettings.create(prefSettingsData);
  console.log(newPrefSettings);

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
};

export async function getPrefSettings(req, res) {
    const id = req.params.customID;
    console.log(id);
    const settings = await prefSettings.findOne({'_id': id});
    console.log(settings);
    if (settings) {
      res.json(settings);
    } else {
      res.status(404).send('Item not found');
    }
}

export async function updatePrefSettings(req, res) {

    const id = req.params.customID;
    const  prefSettingsData  = req.body;
    const updatedPrefSettings = await prefSettings.findByIdAndUpdate(id, prefSettingsData, {new : true, runValidators : true});
    if (!updatedPrefSettings) {
          return res.status(404).json({
            status: 'fail',
            message: 'No preference settings found with that ID'
          });
    }
    // Respond with the updated settings
    res.status(200).json({
      status: 'success',
      data: {
        prefSettings: updatedPrefSettings
      }
    });
}

export async function getUserProfile1  (req,res) {
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
};

export async function getUserProfile2  (req,res) {
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
};

export async function reportUser  (req,res) {
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
};

export async function createNotificationSettings  (req,res) {
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
};

export async function updateNotificationSettings  (req,res) {
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
};

export async function createSettings(req,res,next) {
  try {
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
  } catch (error) {
    console.log(error)
  }
};

export async function updateSettings  (req,res) {
try {
  const { id, ...settingsData } = req.body;
  const user = await User.findById(id);

  const settings = await UserSettings.findOneAndUpdate(
    { _id: user.settings },
    { ...settingsData },
    { new: true }
  );

  if (!settings) {
    return next(new AppError("User settings not found.", 404)); 
  }
  
  res.status(200).json({
    status: "success",
    settings,
  });
} catch (error) {
  console.log(error)
}
};


export async function getUserSettings(req, res) {
    console.log("hey");
    console.log(req.params);
    const id = req.params.customID;
    console.log(id);
    const settings = await UserSettings.findOne({'_id': id});
    console.log(settings);
    if (settings) {
      res.json(settings);
    } else {
      res.status(404).send('Item not found');
    }

}


export async function verifyMe  (req,res) {
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
};
