import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const studentSchema = new mongoose.Schema(
  {
    PRN: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    Name: {
      type: String,
      required: true,
    },
    Roll_Number: {
      type: String,
      required: true,
      unique: true,
    },
    Year: {
      type: String,
      required: true,
      enum: [1, 2, 3, 4],
    },
    Division: {
      type: String,
      required: true,
    },
    Department : {
    type : String,
    required : true
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken:{
      type: String
    }
  },
  { timestamps: true }
);

studentSchema.pre("save",async function(next){
  if(!this.isModified("password"))return next();
  this.password=await bcrypt.hash(this.password,10);
  next();
})

studentSchema.methods.isPasswordCorrect=async function(password){
  return await bcrypt.compare(password,this.password);
}

studentSchema.methods.generateAccessToken=function(){
  return jwt.sign(
    {
      userType:"Student",
      _id:this._id,
      email:this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

studentSchema.methods.generateRefreshToken=function(){
  return jwt.sign(
    {
      userType:"Student",
      _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

export const Student = mongoose.model('Student', studentSchema);
