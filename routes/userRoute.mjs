import express from "express";
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import User from "../models/user.mjs";
import verifyToken from '../middlewares/checkAuth.mjs';


router.post("/signup", async (req, res) => {
    console.log('inside signup route');
    try {
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            phoneNumber: req.body.phoneNumber
        });

        await user.save();

        const payload = {
            _id: user._id,
            phone_number: user.phoneNumber
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);


        console.log(token);

        res.status(201).json({ result: true, message: "Signed up successfully", token: token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ result: false, message: "Failed to sign up" });
    }
});


router.post("/login", async (req, res) => {
    User.findOne({ phoneNumber: req.body.phoneNumber })
    .then( user => {
      if(user){
          const payload = {
              _id: user._id,
              phone_number: user.phoneNumber
          };
          
          const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

          res.status(201).json({ result: true, message: "Logged in successfully", token: token }); 
      }else{
        res.status(500).json({ result: false, message: "User not found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ result: false, message: "Failed to log in" });
    });
});



router.post('/validateToken', verifyToken, (req, res) => {
    res.json({ user: req.user });
  });

export default router;