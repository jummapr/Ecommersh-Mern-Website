import { User } from "../models/User.js";
import ErrorHandler from "../utils/error.js";
import { asyncError } from "./error.js";
import * as jwt from "jsonwebtoken";

export const isAuthentication = asyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login first", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decodedData._id);
  req.user = user;

  next();
});

export const isAdmin = asyncError(async (req, res, next) => {


    if (req.user.role !== "admin") {
      return next(new ErrorHandler("Only admin can access this resource", 401));
    }
  
  
  
    next();
  });
