import ErrorHandler from "../utils/error.js";
import { asyncError } from "../middlewares/error.js";
import { User } from "../models/User.js";
import sendToken from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

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

  // const token = await user.generateToken();
  // //   console.log(token)

  // res.status(200).json({
  //   success: true,x
  //   token,
  // });

  sendToken(user, 201, "User Register Successfully", res);
});

//! Login user

export const loginUser = asyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //! check if user given email and password both
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  //   console.log(token)

  sendToken(user, 201, "Login successFull!", res);
});

//! Logout User
export const logoutUser = asyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logout Successfully",
    });
});

//! Forget password

export const forgetPassword = asyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //! get ResetPassword Token
  const resetToken = user.getResetPasswordToken();
  console.log(resetToken);

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

//! Reset Password
export const resetPassword = asyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, "Password Change Successfully", res);
});

//! Get user Details

export const getUserDetails = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

//! update User Password

export const updatePassword = asyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  const isPasswordMatched = await user.comparePassword(oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, "Password Change Successfully", res);
});

//! Update Profile

export const updateProfile = asyncError(async (req, res, next) => {
  const { name, email } = req.body;

  const newUserData = {
    name,
    email,
  };

  //! We will add cloudinary soon

  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "User Profile Update Successfully",
  });
});

//! Get All users

export const getAllUsers = asyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

//! Get single user details -- Admin

export const getSingleUser_ = asyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User not found with id: ${req.params.id}`));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//! Update User Role
export const updateUserRole = asyncError(async (req, res, next) => {
  const { name,email, role } = req.body;

  const newUserData = {
    name,
    email,
    role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if(!user) {
    return next(new ErrorHandler(`User not found with id: ${req.params.id}`));
  }

  res.status(200).json({
    success: true,
    message: "User Role Updated Successfully",
  });
});

//! Delete user --Admin
export const deleteUser = asyncError(async (req, res, next) => {
  
  const user = await User.findById(req.params.id);

  //* we will remove cloudinary later 
  
  if (!user) {
    return next(new ErrorHandler(`User not found with id: ${req.params.id}`));
  }

  await user.deleteOne();

  
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
