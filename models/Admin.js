import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const AdminSchema = new mongoose.Schema({
  totalDownloads: {
    type: Number,
    default: 0,
  },



});

export default mongoose.model("Admin", AdminSchema);
