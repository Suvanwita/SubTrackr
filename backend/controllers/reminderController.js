const Reminder=require("../models/Reminder");

exports.getAll=async(req,res)=>{
  try{
    const reminders=await Reminder.find({userId:req.user.id}).sort({reminderDate:1});
    res.json(reminders);
  }catch(err){
    res.status(500).json({message: "Server error"});
  }
};

exports.create=async(req,res)=>{
  try{
    const {subscriptionName,reminderDate,note}=req.body;

    if(!subscriptionName||!reminderDate){
      return res.status(400).json({message:"Name and date are required"});
    }

    const parsedDate=new Date(reminderDate);
    if(isNaN(parsedDate.getTime())){
      return res.status(400).json({message:"Invalid reminder date format"});
    }

    const reminder=await Reminder.create({
      subscriptionName,
      reminderDate:parsedDate,
      note,
      userId:req.user.id,
    });

    res.status(201).json(reminder);
  }
  catch(err){
    res.status(500).json({ message:"Error in creating reminder" });
  }
};

exports.update=async(req,res)=>{
  try{
    const {subscriptionName,reminderDate,note,notified}=req.body;

    const parsedDate=new Date(reminderDate);
    if(isNaN(parsedDate.getTime())){
      return res.status(400).json({message:"Invalid reminder date format"});
    }

    const updated=await Reminder.findByIdAndUpdate(
      req.params.id,
      {
        subscriptionName,
        reminderDate:parsedDate,
        note,
        notified,
      },
      {new:true}
    );

    res.json(updated);
  } 
  catch(err){
    res.status(500).json({message:"Error in updating reminder"});
  }
};

exports.remove=async(req,res)=>{
  try{
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({message:"Reminder deleted"});
  }catch(err){
    res.status(500).json({message:"Error in deleting reminder"});
  }
};
