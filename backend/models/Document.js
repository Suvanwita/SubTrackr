const mongoose=require('mongoose');

const documentSchema=new mongoose.Schema({
  title:{
    type: String, 
    required: true 
  },
  fileUrl:{ 
    type: String, 
    required: true 
  },
  uploadedAt:{ 
    type: Date, 
    default: Date.now 
  },
  userId:{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true 
  }
});

module.exports=mongoose.model('Document', documentSchema);
