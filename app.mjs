import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRoutes.mjs';
import AppError from './utils/appError.mjs'; // Make sure this is also .mjs
import profileLikeRouter from './routes/profileLikeRoute.mjs';
import profileLikesListRouter from './routes/profileLikesListRoute.mjs';
import recommendationRouter from './routes/recommendationRoute.mjs';
import placesRouter from './routes/placesRoutes.mjs';

const app = express(); 

const port = process.env.PORT || 1000;

// Middlewares
app.use(cors());
app.options("*", cors());
app.use(express.json());

app.use("/user", userRouter);
app.use("/profile-like", profileLikeRouter);
app.use("/profile-likes-list", profileLikesListRouter);
app.use("/getRecommendedProfiles", recommendationRouter);
app.use("/places", placesRouter);

app.all("*", (req, res, next) => {
  const err = new AppError(`Can't find ${req.url} on the server.`, 404);
  next(err);
});
export default  app;
