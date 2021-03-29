// app.get("/", (req, res) => {
//   //   res.status(200).send("Hello from the server side");
//   res
//     .status(200)
//     .json({ message: "Hello from the server side", app: "Natours" });
// });

// app.post("/", (req, res) => {
//   res.send("You can post to this endpoint");
// });
// const fs = require("fs");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const bookingRouter = require("./routes/bookingRoutes");

const viewRouter = require("./routes/viewRoutes");

const app = express();
app.use(express.static(path.join(__dirname, "public")));

app.engine("pug", require("pug").__express);
app.set("views", path.join(__dirname, "views"));

app.set("view engine", "pug");

// A. Global Middlewares
//Serving static files
// app.use(express.static(`${__dirname}/public`));

//Set Security HTTP headers
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this ip, Please try again later!",
});

app.use("/api", limiter);

//Body Parser, reading data from the body into req.body
app.use(express.json({ limit: "10Kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

//Our own middleware
// app.use((req, res, next) => {
//   console.log("Hello from the middleware");
//   next();
// });
app.use(compression());
//Testing middleware just for basics of how middleware works
app.use((req, res, next) => {
  //manipulate the request
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);

  next();
});

// //Starting with implementing API of tours route
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, "utf-8")
// );

// B. Route handler functions

//I). Route handler functions for tours resource -> MOved to tourRoutes.js
//Route handler for get request
// const getAllTours = (req, res) => {
//   // console.log(req.requestTime);
//   // Sends all of the tours data
//   res.status(200).json({
//     status: "success",
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// };

// //Route handler to get a particular tour
// const getOneTour = (req, res) => {
//   console.log(req.params);

//   //Trick to convert a string to a number
//   const id = req.params.id * 1;

//   if (id > tours.length) {
//     return res.status(404).json({
//       status: "Fail",
//       message: "Invalid Id",
//     });
//   }
//   const tour = tours.find((el) => el.id === id);
//   res.status(200).json({
//     status: "success",
//     // results: tours.length,
//     data: {
//       tour,
//     },
//   });
// };

// //Route handler to create a tour
// const createTour = (req, res) => {
//   console.log(req.body);

//   //Since at this point we dont have any database, so we will manually calculate the id of the tour
//   console.log(tours.length);
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body); //data of req.body is in postman

//   //Adding the new tour in the tours array
//   tours.push(newTour);

//   //persisting the newly created tour
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: "success",
//         data: {
//           tour: newTour,
//         },
//       });
//     }
//   );
// };

// //Route handler for updating a tour
// const updateTour = (req, res) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: "Fail",
//       message: "Invalid Id",
//     });
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       tour: "<updated> tour here</updated>",
//     },
//   });
// };

// //Route handler for deleting a request
// const deleteTour = (req, res) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: "Fail",
//       message: "Invalid Id",
//     });
//   }

//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// };

//II). Route handler functions for users resource

//Route handler function to get all Users
// const getAllUsers = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Handler function logic needs to be implemented",
//   });
// };

// //Route handler function to get one User
// const getOneUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Handler function logic needs to be implemented",
//   });
// };

// //Route handler function to create a new user
// const createUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Handler function logic needs to be implemented",
//   });
// };

// //Route handler function to update a user
// const updateUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Handler function logic needs to be implemented",
//   });
// };

// //Route handler function to delete a user
// const deleteUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Handler function logic needs to be implemented",
//   });
// };

//C. Routes -> All the routes moved to their respective tourRoutes.js and userRoutes.js file

// //Route for get request to get all tours
// app.get("/api/v1/tours", getAllTours);

// //Route to get a particular tour
// app.get("/api/v1/tours/:id", getOneTour);

// //Route for post request to create a new tour
// app.post("/api/v1/tours", createTour);

// //Route for patch request to update a tour
// app.patch("/api/v1/tours/:id", updateTour);

// //Route for delete request to delete a tour
// app.delete("/api/v1/tours/:id", deleteTour);

//OR we can do this

// I) Tours Routes

// const tourRouter = express.Router();
// const userRouter = express.Router();

// tourRouter
//   .route("/") // root url of our application
//   .get(getAllTours)
//   .post(createTour);
// tourRouter
//   .route("/:id")
//   .get(getOneTour)
//   .patch(updateTour)
//   .delete(deleteTour);

// II) Users Routes

// userRouter
//   .route("/") // root url of our application
//   .get(getAllUsers)
//   .post(createUser);
// userRouter
//   .route("/:id")
//   .get(getOneUser)
//   .patch(updateUser)
//   .delete(deleteUser);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/booking", bookingRouter);

app.use("/", viewRouter);

app.all("*", (req, res, next) => {
  //Initial error response
  // res.status(404).json({
  //   status: "Fail",
  //   message: `can't find ${req.originalUrl} on this server`,
  // });

  //using Error object to send error response
  // const err = new Error(`can't find ${req.originalUrl} on this server`);
  // err.statusCode = 404;
  // err.status = "Fail";

  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

//Global error handling middleware function
// app.use((err, req, res, next) => {
//   console.log(err.stack);

//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || "error";
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });
app.use(globalErrorHandler);

//Moved to server.js
// const port = 3000;
// app.listen(port, "127.0.0.1", () => {
//   console.log("Server started");
// });

module.exports = app;
