const User=require("../models/User");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

exports.register=async(req,res)=>{
  const {name,email,password}=req.body;
  const exists=await User.findOne({email});
  if(exists)
    return res.status(400).json({message: "User already exists"});

  const hashed=await bcrypt.hash(password,10);
  const user=await User.create({name,email,password:hashed});

  const token=jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
  res.json({token});
};

exports.login=async(req,res)=>{
  const {email,password }=req.body;
  const user=await User.findOne({email});
  if(!user)
    return res.status(400).json({message: "Invalid credentials"});

  const match = await bcrypt.compare(password, user.password);
  if(!match)
    return res.status(400).json({message: "Invalid credentials"});

  const token=jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:"7d"});
  res.json({token});
};
