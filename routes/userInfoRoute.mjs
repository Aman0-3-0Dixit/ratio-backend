import express from "express";
import checkAuth from "../middlewares/checkAuth.mjs";
import User from "../models/user.mjs";
import UserInfo from "../models/userInfo.mjs";

const router = express.Router();

router.post("/addUserInfo", checkAuth, async (req, res) => {
  try {
    console.log('Inside addUserInfo route');
    const data = req.body;
    console.log('Received data:', data);

    const user = await User.findById(req.user.userId);
    console.log('UserId:', req.user.userId);
    console.log('User found:', user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userInfo = new UserInfo({
      _id: req.user.userId,
      phoneNumber: data.phoneNo,
      firstName: data.firstName,
      email: data.email,
      dateOfBirth: new Date(data.dateOfBirth),
      gender: data.gender.charAt(0).toUpperCase() + data.gender.slice(1).toLowerCase(),
      homeCity: data.city,
      partnerPreferences: {
        genderPreference: data.partnerGender.charAt(0).toUpperCase() + data.partnerGender.slice(1).toLowerCase(),
        partnerAge: data.age
      },
      cuisinePreferences: data.cuisinePref.split(',').map(c => c.trim()),
      bio: data.bio,
      university: data.university,
      profession: data.profession,
      ethnicity: data.ethnicity.split(',').map(e => e.trim()),
      interests: data.interests.split(',').map(i => i.trim()),
      musicPrompt: data.themeSongPrompt,
      themeSong: data.themeSong,
      writtenPrompt: data.writtenPrompt,
      images: data.images.image_urls,
      location: data.location,
      notifications: data.notifications,
    });

    await userInfo.save();
    console.log('User info saved successfully');
    res.status(201).json({ result: true, message: "Successfully added the user information" });

  } catch (err) {
    console.log('Error adding user information:', err);
    res.status(500).json({ result: false, message: "Failed to add user information" });
  }
});

export default router;


