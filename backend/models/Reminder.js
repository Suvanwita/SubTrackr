const mongoose=require("mongoose");

const reminderSchema=new mongoose.Schema({
  subscriptionName:{
    type: String,
    required: true 
  },
  reminderDate:{ 
    type: Date, 
    required: true 
  },
  note: String,
  notified:{ 
    type: Boolean, 
    default: false 
  },
  userId:{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  }
});

module.exports=mongoose.model("Reminder", reminderSchema);
