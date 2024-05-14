const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("Unhandled exception 💥 Shutting down.");
  console.log(err);
  process.exit(1);
});

const app = require("./app");

const DB =
  // "mongodb+srv://kshitijg:65p31pMH8LdOgAvq@cluster0.1vkr70l.mongodb.net/ratio-backend?retryWrites=true&w=majority";
  "mongodb+srv://mohith:7XsxP34sfPaby5Pu@ratiobackend0.turjqqr.mongodb.net/?retryWrites=true&w=majority&appName=ratioBackend0"
mongoose
  .connect(DB)
  .then((con) => {
    console.log("DB connection established successfully.");
  })
  .catch((err) => {
    console.log(err.message);
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`); // eslint-disable-line
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection 💥 Shutting down.");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
