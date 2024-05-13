const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError.js");

const app = express();

const port = process.env.PORT || 8000;

// Middlewares
app.use(cors());
app.options("*", cors());
app.use(express.json());

app.use("/users", userRouter);

app.all("*", (req, res, next) => {
  const err = new AppError(`Can't find ${req.url} on the server.`, 404);
  next(err);
});

module.exports = app;
