const express = require("express");

//Importing all the route handler functions from tourController
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");
const reviewRouter = require("./../routes/reviewRoutes");

//All the route handler functions are exported to tourController.js file
// const fs = require("fs");

// //Starting with implementing API of tours route
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, "utf-8")
// );

// //I). Route handler functions for tours resource
// //Route handler for get request
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

// const tourRouter = express.Router();
//Following the convention we will rename tourRouter to be router.
const router = express.Router();

router.use("/:tourId/reviews", reviewRouter);

//Middleware for url with id
// router.param("id", tourController.checkID);

//Creating a middleware to check request body data
// check if body contains the name and price property
// if not send 404 status(bad request)
// Add to the post handler stack
router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getTourStats);
router
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin", "lead-guide", "guide"),
    tourController.getMonthlyPlan
  );

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(tourController.getToursWithin);

router.route("/distances/:latlng/unit/:unit").get(tourController.getDistances);

router
  .route("/") // root url of our application
  // .get(authController.protect, tourController.getAllTours)
  .get(tourController.getAllTours)
  .post(
    /*tourController.checkBody,*/ authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.createTour
  );
router
  .route("/:id")
  .get(tourController.getOneTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = router;
