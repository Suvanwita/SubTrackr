const mongoose=require("mongoose");

const subscriptionSchema=new mongoose.Schema({
  userId:{ 
    type:mongoose.Schema.Types.ObjectId,
    ref:"User" 
  },
  name: String,
  category: String,
  amount: Number,
  billingCycle: String, 
  nextBillingDate: Date,
  paymentMethod: String,
  notes: String
});

module.exports=mongoose.model("Subscription", subscriptionSchema);
