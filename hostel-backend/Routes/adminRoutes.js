const express=require("express");
const {register,login,getData,unVerifiedHostels,approve,disapprove,verifiedHostels}=require("../Controller/adminController");
const router=express.Router();
router.post("/register",register);
router.post("/login",login);
router.get("/getdata/:email",getData);
router.get("/getunverifiedhostels",unVerifiedHostels);
router.get("/getverifiedhostels",verifiedHostels);
router.get("/approvehostel/:id",approve);
router.get("/unapprovehostel/:id",disapprove);



module.exports=router;