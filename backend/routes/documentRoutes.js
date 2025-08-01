const express=require('express');
const router=express.Router();

const protect=require('../middleware/authMiddleware');
const upload=require('../middleware/uploadMiddleware');
const {getDocuments,uploadDocument,deleteDocument}=require('../controllers/documentController');

router.use(protect);
router.get('/', getDocuments);
router.post('/', upload.single('file'), uploadDocument);
router.delete('/:id', deleteDocument);

module.exports = router;
