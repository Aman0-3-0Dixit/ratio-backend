
import express from 'express';
import mongoose from 'mongoose';

import cors from 'cors';

import userRouter from './routes/userRoutes.mjs';
import AppError from './utils/appError.mjs'; // Make sure this is also .mjs


const app = express(); 

const port = process.env.PORT || 1000;

// Middlewares
app.use(cors());
app.options("*", cors());
app.use(express.json());

app.use("/user", userRouter);

app.all("*", (req, res, next) => {
  const err = new AppError(`Can't find ${req.url} on the server.`, 404);
  next(err);
});
export default  app;
