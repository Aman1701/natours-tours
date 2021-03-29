// const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");
const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  // console.log(req.files);

  if (!req.files.imageCover || !req.files.images) return next();

  //1) cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({
      quality: 90,
    })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  //2)Images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({
          quality: 90,
        })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});
//Starting with implementing API of tours route
//For testing purpose
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, "utf-8")
// );

//No longer needed because we will use mongoDB
//Param Middleware function to check Id
// exports.checkID = (req, res, next, val) => {
//   console.log(val);
//   //Trick to convert a string to a number
//   const id = req.params.id * 1;

//   if (id > tours.length) {
//     return res.status(404).json({
//       status: "Fail",
//       message: "Invalid Id",
//     });
//   }
//   next();
// };

//Param middleware function to check the request body data
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(404).json({
//       status: "Fail",
//       message: "Missing name or price",
//     });
//   }
//   next();
// };

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

//I). Route handler functions for tours resource
//Route handler for get request
exports.getAllTours = factory.getAll(Tour);
// exports.getAllTours = catchAsync(async (req, res, next) => {
// console.log("I started");
// console.log(req.requestTime);
// try {
// console.log(req.query);

// //Build Query
// //1(A) Filtering
// //Making a shallow copy of req.query object
// const queryObj = { ...req.query };
// //Excluding the fields that should not be used while filtering data in the database
// const excludedFields = ["page", "sort", "limit", "fields"];
// //Remove these fields from our queryObject
// excludedFields.forEach((el) => delete queryObj[el]);
// // console.log(req.query, queryObj);

// //TO get all the tours from database with special mongoose methods

// //1(B)Advanced Filtering
// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
// // console.log(JSON.parse(queryStr));
// //1st way:-
// let query = Tour.find(JSON.parse(queryStr));
// console.log(req.query);

// {difficulty : 'easy', duration : { $gte : 5}}
//gte,gt,lte,lt

//2nd way:-
// const query = Tour.find()
//   .where("duration")
//   .equals(5)
//   .where("difficulty")
//   .equals("easy");

// //2) Sorting
// if (req.query.sort) {
//   const sortBy = req.query.sort.split(",").join(" ");
//   query = query.sort(sortBy);
//   //in mongoose we say sort('price ratingsAverage')
// } else {
//   query = query.sort("-createdAt");
// }

// //3) Field limiting
// if (req.query.fields) {
//   const fields = req.query.fields.split(",").join(" ");
//   query = query.select(fields);
// } else {
//   query = query.select("-__v");
// }

// //4) Pagination
// //Example query;- page=2&limit=10, 1-10 page1, 11-20  page2
// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 100;
// const skip = (page - 1) * limit;
// query = query.skip(skip).limit(limit);
// if (req.query.page) {
//   const numTours = await Tour.countDocuments();
//   if (skip >= numTours) {
//     throw new Error("This Page doesn't exist");
//   }
// }

//Execute the query
// const features = new APIFeatures(Tour.find(), req.query)
//   .filter()
//   .sort()
//   .limitFields()
//   .paginate();
// console.log(features);
// const tours = await features.query;

// // Sends all of the tours data
// res.status(200).json({
//   status: "success",
//   results: tours.length,
//   data: {
//     tours,
//   },
// });
// } catch (err) {
//   res.status(404).json({
//     status: "error",
//     message: err.message,
//   });
// }
// });

//Route handler to get a particular tour
exports.getOneTour = factory.getOne(Tour, { path: "reviews" });
// exports.getOneTour = catchAsync(async (req, res, next) => {
//   // try {
//   const tour = await Tour.findById(req.params.id).populate("reviews");
//   //Same as
//   //Tour.findOne({_id : req.params.id})

//   if (!tour) {
//     return next(new AppError("No tour found with that ID", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     // results: tours.length,
//     data: {
//       tour,
//     },
//   });
// } catch (err) {
//   res.status(404).json({
//     status: "error",
//     message: err.message,
//   });
// }

// console.log(req.params);

// const id = req.params.id * 1;

// const tour = tours.find((el) => el.id === id);
// });

// const catchAsync = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch((err) => next(err));
//   };
// };
//Route handler to create a tour
exports.createTour = factory.createOne(Tour);
// exports.createTour = catchAsync(async (req, res, next) => {
// console.log(req.body);
// //Since at this point we dont have any database, so we will manually calculate the id of the tour
// console.log(tours.length);
// const newId = tours[tours.length - 1].id + 1;
// const newTour = Object.assign({ id: newId }, req.body); //data of req.body is in postman
// //Adding the new tour in the tours array
// tours.push(newTour);
// //persisting the newly created tour
// fs.writeFile(
//   `${__dirname}/dev-data/data/tours-simple.json`,
//   JSON.stringify(tours),
//   (err) => {
//     res.status(201).json({
//       status: "success",
//       data: {
//         tour: newTour,
//       },
//     });
//   }
// );
//New way of creating new tour
// const newTour = await Tour.create(req.body);

// res.status(201).json({
//   status: "success",
//   data: {
//     tour: newTour,
//   },
// });
// try {
// } catch (err) {
//   res.status(400).json({
//     status: "Fail",
//     message: "Invalid data sent!",
//   });
// }
// });

//Route handler for updating a tour
exports.updateTour = factory.updateOne(Tour);
// exports.updateTour = catchAsync(async (req, res, next) => {
//   // try {
//   //Get the tour from id and then update it
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!tour) {
//     return next(new AppError("No tour found with that ID", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       tour,
//     },
//   });
//   // } catch (err) {
//   //   res.status(400).json({
//   //     status: "Fail",
//   //     message: "Invalid data sent!",
//   //   });
//   // }
// });

//Route handler for deleting a request
exports.deleteTour = factory.deleteOne(Tour);
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   //Get the tour from id and then delete it
//   // try {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError("No tour found with that ID", 404));
//   }

//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
//   // } catch (err) {
//   //   res.status(400).json({
//   //     status: "Fail",
//   //     message: err,
//   //   });
//   // }
// });

//USing data Aggregation(MAtching and Grouping)
exports.getTourStats = catchAsync(async (req, res, next) => {
  // try {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        // _id: "$ratingsAverage",
        numRatings: { $sum: "$ratingsQuantity" },
        numTours: { $sum: 1 },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
    // {
    //   $match: { _id: { $ne: "EASY" } },
    // },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
  // } catch (err) {
  //   res.status(400).json({
  //     status: "Fail",
  //     message: err,
  //   });
  // }
});

//Using data Aggregation(Unwinding and Projecting)
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  // try {
  const year = req.params.year;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: {
        month: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
  // } catch (err) {
  //   res.status(400).json({
  //     status: "Fail",
  //     message: err,
  //   });
  // }
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format lat, lng",
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  const multiplier = unit === "mi" ? 0.000621371 : 0.001;

  // const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format lat, lng",
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      data: distances,
    },
  });
});
