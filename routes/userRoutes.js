const express = require("express");
const multer = require("multer");

const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

//All the route handler functions are exported to userController.js file
// //Route handler function to get all Users
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

//Following the convention we will rename tourRouter to be router.
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

//Protect all routes after this middleware
router.use(authController.protect);

router.patch(
  "/updateMyPassword",
  // authController.protect,
  authController.updatePassword
);

router.get(
  "/me",
  // authController.protect,
  userController.getMe,
  userController.getOneUser
);
router.patch(
  "/updateMe",
  /*authController.protect,*/
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete("/deleteMe", /*authController.protect,*/ userController.deleteMe);

router.use(authController.restrictTo("admin"));

router
  .route("/") // root url of our application
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route("/:id")
  .get(userController.getOneUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
