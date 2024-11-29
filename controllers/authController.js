import User from "../models/User.js";
import BadRequestError from "../errors/bad-request.js";
import sendMail from "../utils/emailSender.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import emailvalidator from "email-validator";
import bcrypt from "bcryptjs";

// User registration

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!email || !password || !username) {
    throw new BadRequestError("Please Provide all values");
  }

  const user = await User.create({ email, password, username });
  const token = user.createJWT();

  if (user) {
    await sendMail(email, {
      subject: "Verify email",
      content: `<div><p>Please click on the button below to verify your email <a href = 'http://localhost:3000/verify/${token}'>Click here</a></p>
      </div>`,
    });
  }
  res.status(200).json({ user, token });
};

// login user

const loginUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please Provide values");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new BadRequestError("invalid credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new BadRequestError("invalid credentials");
  }
  const token = user.createJWT();
  user.password = undefined;

  res
    .status(StatusCodes.OK)
    .json({
      username: user.username,
      token,
      email: user.email,
      verified: user.verified,
    });
};

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

  res
    .status(StatusCodes.OK)
    .json({
      username: user.username,
    });
};

//Verify user

const verifyUser = async (req, res) => {
  const { token } = req.query;
  console.log(token);

  const payload = jwt.verify(token, process.env.JWT_SECRET);

  if (!payload) {
    throw new BadRequestError("User cannot be verified");
  }
  const { userId } = payload;
  const setVerification = { verified: true };
  const updateVerification = await User.findOneAndUpdate(
    { _id: userId },
    setVerification,
    {
      new: true,
    }
  );

  if (updateVerification) {
    res.status(200).json({ userId });
  }
};

//forgot password

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  if (!email) {
    throw new BadRequestError("Please provide an email");
  }
  if (!emailvalidator.validate(email)) {
    throw new BadRequestError("Please provide a valid email");
  }

  const checkemail = await User.findOne({ email: email });

  if (!checkemail) {
    throw new BadRequestError("Account not found");
  }
  const token = checkemail.createJWT();

  await sendMail(email, {
    subject: "Reset Password",
    content: `<div><p>Please click on the button below to reset your password<a href = 'http://localhost:3000/resetpassword/${token}'>Click here</a></p>
    </div>`,
  });

  res.status(200).send(email);
};

//Change password

const changePassword = async (req, res) => {
  const { cpassword, password, token } = req.body;
  console.log(`This the ${cpassword} + ${password} + ${token} `);

  if (cpassword !== password) {
    throw new BadRequestError("Password do not match");
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  if (!payload) {
    throw new BadRequestError("Invalid token");
  }
  const { userId } = payload;
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);
  const setNewPassword = { password: newPassword };
  const updateVerification = await User.findOneAndUpdate(
    { _id: userId },
    setNewPassword,
    {
      new: true,
    }
  );
  if (!updateVerification) {
    throw new BadRequestError("Invalid token");
  }
  res.status(StatusCodes.OK).json({ userId });
};

//check user token
const checkUserToken = async (req, res) => {
  const { token } = req.query;
  const payload = jwt.verify(token, process.env.JWT_SECRET);

  if (!payload) {
    throw new BadRequestError("User cannot be verified");
  }

  const { userId } = payload;
  res.status(StatusCodes.OK).json({ userId });
};

export {
  registerUser,
  loginUser,
  verifyUser,
  forgotPassword,
  changePassword,
  checkUserToken,
  loginAdmin,
};
