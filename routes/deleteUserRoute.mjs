import { Router } from "express";
const router = Router();
import checkAuth from "../middlewares/checkAuth.mjs";
import dotenv from 'dotenv';
dotenv.config();
import DeleteUser from "../models/deleteUser.mjs";
import { sendDeleteEmail } from "../services/sendgrid.mjs";
import { searchUserInfoById, updateByUserId } from "../services/mongodb/users.mjs";
import User from "../models/user.mjs";

router.post("/deleteUser", checkAuth, async (req, res) => {
    console.log('inside deleteUser route');
    let setData;

    const deleteUser = new DeleteUser({
        _id: req.userId,
        phoneNumber: req.phoneNumber
    });

    await deleteUser.save();

    searchUserInfoById(req.userId).then( (userResponse) => {

        if(!userResponse){
            res.status(406).json({
                result: false,
                message: "User not found"
            });
            return;
        }

        setData = {
            is_active: false
        }

        updateByUserId(req.userId, setData).catch( (error) => {
            res.status(406).json({
                result: false,
                message: "Failed to disable the user"
            });
            return;
        });

        const email = userResponse.email;

        sendDeleteEmail(email)
                .then( () => {
                    res.status(200).json({
                        result: true,
                        message: "Account deletion email sent suuccessfylly",
                    });
                })
                .catch( () => {
                    res.status(500).json({
                        result: false,
                        message: "Failed to send account deletion email",
                    });
                });
    });
});

export default router;