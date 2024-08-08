import dotenv from 'dotenv';
dotenv.config();
import connectDB from './db.mjs';
import bodyParser from "body-parser";
import express from 'express';
import cors from 'cors';
import photoUploadRoutes from './routes/photoUploadRoute.mjs';
import userInfoRoutes from './routes/userInfoRoute.mjs';
import photoAccessRoutes from './routes/photoAccessRoute.mjs';
import userRoutes from './routes/userRoute.mjs';
import refreshTokenRoutes from './routes/refreshTokenRoute.mjs';
import deleteUserRoutes from './routes/deleteUserRoute.mjs';
import cron from 'node-cron';
import { checkUserDeletion } from './cronJobs/deleteUser.mjs';
import userRouter from './routes/userRoutes.mjs';
import AppError from './utils/appError.mjs'; // Make sure this is also .mjs
import profileLikeRouter from './routes/profileLikeRoute.mjs';
import profileLikesListRouter from './routes/profileLikesListRoute.mjs';
import recommendationRouter from './routes/recommendationRoute.mjs';
import placesRouter from './routes/placesRoutes.mjs';

const app = express(); 
const { urlencoded } = bodyParser;
const port = process.env.PORT || 1000;



// Middlewares
app.use(cors());
//connectDB();

const handleUserDeletion = () => {
  checkUserDeletion(); 
};

cron.schedule('11 1 * * *', handleUserDeletion);

app.use(urlencoded({ extended: false }));
app.use(bodyParser.json());

app.options("*", cors());
app.use(express.json());

app.use("/user", userRouter);
app.use("/profile-like", profileLikeRouter);
app.use("/profile-likes-list", profileLikesListRouter);
app.use("/getRecommendedProfiles", recommendationRouter);
app.use("/places", placesRouter);
app.use('/photoUploadRoute', photoUploadRoutes);
app.use('/userInfoRoute', userInfoRoutes);
app.use('/photoAccessRoute', photoAccessRoutes);
app.use("/userRoute", userRoutes);
app.use("/refreshTokenRoute", refreshTokenRoutes);
app.use('/deleteUserRoute', deleteUserRoutes);

app.all("*", (req, res, next) => {
  const err = new AppError(`Can't find ${req.url} on the server.`, 404);
  next(err);
});

export default  app;
