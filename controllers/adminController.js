import User from "../models/User.js";
import BadRequestError from "../errors/bad-request.js";
import sendMail from "../utils/emailSender.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import emailvalidator from "email-validator";
import bcrypt from "bcryptjs";



// login Administrator

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  if (username !== "admin") {
    throw new BadRequestError("invalid credentials please contact the system administrator");
  }
  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    throw new BadRequestError("invalid credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new BadRequestError("invalid credentials");
  }

  const token = user.createJWT();

  res
    .status(StatusCodes.OK)
    .json({
      username: user.username,
      token : token
    });
};


export {
  loginAdmin,
};
