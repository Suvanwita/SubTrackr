const Subscription = require("../models/Subscription");

exports.getAll=async(req,res)=>{
  const subs=await Subscription.find({userId: req.user.id});
  res.json(subs);
};

exports.create=async(req,res)=>{
  const sub=await Subscription.create({...req.body, userId:req.user.id});
  res.json(sub);
};

exports.update=async(req,res)=>{
  const sub=await Subscription.findByIdAndUpdate(req.params.id, req.body, {new: true});
  res.json(sub);
};

exports.remove=async(req,res)=>{
  await Subscription.findByIdAndDelete(req.params.id);
  res.json({message: "Subscription deleted"});
};
