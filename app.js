const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRouter = require("./routes/userRoutes");

const app = express();

const DB =
  "mongodb+srv://kshitijg:65p31pMH8LdOgAvq@cluster0.1vkr70l.mongodb.net/ratio-backend?retryWrites=true&w=majority";

mongoose.connect(DB).then((con) => {
  console.log("DB connection established successfully.");
});

const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.options("*", cors());
app.use(express.json());

app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

app.all("*", (req, res, next) => {
  const err = new AppError(`Can't find ${req.url} on the server.`, 404);
  next(err);
});

module.exports = app;
