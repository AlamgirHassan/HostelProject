const express=require("express");
const {register,login,hostelsList}=require("../Controller/userController");
const router=express.Router();
router.post("/register",register);
router.post("/login",login);
router.post("/gethostels",hostelsList);



module.exports=router;