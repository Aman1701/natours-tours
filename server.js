const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception. Shutting Down!!!");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((/*con*/) => {
    // console.log(con.connections);
    console.log("DB connection successful");
  });

// console.log(process.env);

// //Schema

//Moved to tourModel.js
// const tourSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   rating: {
//     type: Number,
//     default: 4.5,
//   },
//   price: {
//     type: Number,
//     required: [true, "A tour must have a price"],
//   },
// });

// //Model on the basis of schema
// const Tour = mongoose.model("Tour", tourSchema);

//Just for testing
//Create document on this model
// const testTour = new Tour({
//   name: "The Park Camper",
//   price: 997,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const port = process.env.PORT || 3000;
const server = app.listen(port, "127.0.0.1", () => {
  console.log("Server started");
  console.log("go next");
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection!!!!!!!!!! Shutting Down!!!");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
