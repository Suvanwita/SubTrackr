const Document=require('../models/Document');

exports.getDocuments=async(req, res)=>{
  const docs=await Document.find({userId: req.user.id});
  res.json(docs);
};

exports.uploadDocument=async(req, res)=>{
  if(!req.file){
    return res.status(400).json({message: 'File upload failed'});
  }
  const doc=await Document.create({
    title: req.body.title,
    fileUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
    userId: req.user.id,
    uploadedAt: new Date(),
  });
  res.status(201).json(doc);
};

exports.deleteDocument=async(req,res)=>{
  await Document.findByIdAndDelete(req.params.id);
  res.json({message: 'Document deleted'});
};
