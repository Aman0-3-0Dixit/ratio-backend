import mongoose from "mongoose";
import ProfileLike from "../models/profileLike.mjs";

export async function profileLike (req, res){
    try {
        const userFrom = req.body.userFrom;
        const userTo = req.body.userTo;

        const profileLike = new ProfileLike({
            _id: new mongoose.Types.ObjectId(),
            userFrom: userFrom,
            userTo: userTo
        });

        await profileLike.save();

        res.status(201).json({ result: true, message: "Profile like saved successfully" });
    } catch (err) {
        console.log(err);
        if (err.code === 11000 && err.keyPattern && err.keyPattern.userFrom && err.keyPattern.userTo) {
            res.status(409).json({ result: false, message: "Profile like with the same userFrom and userTo pair already exists" });
        } else {
            res.status(500).json({ result: false, message: "Failed to save profile like" });
        }
    }
};