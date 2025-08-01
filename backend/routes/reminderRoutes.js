const express=require("express");
const router=express.Router();

const protect=require("../middleware/authMiddleware");
const {getAll,create,update,remove}=require("../controllers/reminderController");

router.use(protect);
router.get("/", getAll);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports=router;
