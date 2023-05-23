import ErrorHandler from "../utils/error.js";
import { asyncError } from "../middlewares/error.js";
import { User } from "../models/User.js";

export const createNewUser = asyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  //! Check if user already exist
  let user = await User.findOne({ email });

  if (user) return next(new ErrorHandler("user already exist", 400));

  user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is a sample id",
      url: "profile pic url",
    },
  });

  const token = await user.generateToken();
  //   console.log(token)

  res.status(200).json({
    success: true,
    token,
  });
});

//! Login user

export const loginUser = asyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //! check if user given email and password both
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if(!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if(!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const token = await user.generateToken();
  //   console.log(token)

  res.status(200).json({
    success: true,
    token,
  });

});
