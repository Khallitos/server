import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import "express-async-errors";
import connectDb from "./db/connectDb.js";
import  authRouter  from "./routes/authRoutes.js";
import  uploadRouter from "./routes/uploadRoutes.js"
import adminRouter from "./routes/adminRoutes.js"
import errorHandlerMiddleware from "./middleware/error-handler.js"
import multer from "multer"
import { nanoid } from "nanoid";
import path from "path"
import bodyParser from 'body-parser';
import jwtChecker from "./middleware/jwtChecker.js";


const app = express();


app.use(express.json({limit: "10mb", extended: true}))
app.use(express.urlencoded({limit: "10mb", extended: true, parameterLimit: 50000}))
dotenv.config();
const PORT = process.env.PORT_NO || 6000;
if(process.env.NODE_ENV !=="production"){
  app.use(morgan("dev"));
}

const storage = multer.memoryStorage({
  destination:(req,file,cb)=>{
    cb(null,'uploads')
  },
 filename:(req,file,cb)=>{
  console.log(file)
  cb(null,
    `${file.originalname.split('.')[0]}.jpg`
  )
 }
})
const upload = multer({storage:storage,
limits: {
  fileSize: 10000000
},
fileFilter(req,file,cb){
  if(!file){
    return cb(new Error ("Please upload a coverart and a song"))
  }
  // console.log(file)
  // const files = file
  // console.log(files)
  // const size1 = files.file1.mimetype
  // console.log(size1)
  // console.log(size1)
  // const mimetype1 = files.file1.mimetype
  // console.log(mimetype1)

  // const size = files.file[0].size
  // const mimetype = files.file1[0].mimetype


  // if(size1>6000000){

  //   return cb(new Error("Music file should be less than 10mb"))
  // }

  // if(mimetype1 !== "audio/mpeg" ||  "audio/mp3" || "audio/mp4" || "audio/wav"){
  //   return cb(new Error("Image should be in jpg/png/jpeg format"))
  // }



  // if(size>5000000){

  //   return cb(new Error("Image file should be less than 5mb"))
  // }

  // if(mimetype !== "image/jpeg" || "image/jpg" || "image/png"){
  //   return cb(new Error("Image should be in jpg/png/jpeg format"))
  // }



  // if(file.)
  // if(!file.originalname.match(/\.(jpg|jpeg|png)$/i)){
  //   return cb(new Error("Please upload an image with type of jpg or png"))
  // }
  // console.log(file[1].originalname)
  // if(file.file1.fieldname !== "image/png" || "image/jpg" || "image/jif" || "image/jpeg"){
  //   return cb(null,false ,new Error("Image file must be in  a  (jpg,png,jpeg)"))

  // }
  cb(null,true)
}
})
const multipleUpload = upload.fields([{ name: 'file' }, { name: 'file1'}])

app.use(express.static('./public'));
app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/adminauth",jwtChecker,adminRouter)
app.use("/api/v1/upload",jwtChecker,multipleUpload,uploadRouter)


app.use(errorHandlerMiddleware);

app.listen(PORT, () => console.log(`server is running ${PORT}`));

const start = async () => {
  try {
    const connect = await connectDb(process.env.MONGO_URI);
  } catch (error) {
    console.log(error);
  }
};
start();
