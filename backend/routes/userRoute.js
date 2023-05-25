import express from "express";
import {
  createNewUser,
  deleteUser,
  forgetPassword,
  getAllUsers,
  getSingleUser_,
  getUserDetails,
  loginUser,
  logoutUser,
  resetPassword,
  updatePassword,
  updateProfile,
  updateUserRole,
} from "../controllers/userController.js";
import { isAdmin, isAuthentication } from "../middlewares/auth.js";

const router = express.Router();

router.route("/register").post(createNewUser);
router.route("/login").post(loginUser);
router.route("/password/forget").post(forgetPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logoutUser);
router.route("/me").get(isAuthentication, getUserDetails);

router.route("/password/update").put(isAuthentication, updatePassword);
router.route("/me/update").put(isAuthentication, updateProfile);

//! Admin Route
router.route("/admin/users").get(isAuthentication, isAdmin, getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthentication, isAdmin, getSingleUser_)
  .put(isAuthentication, isAdmin, updateUserRole)
  .delete(isAuthentication, isAdmin, deleteUser);

export default router;
