const express=require("express");
const {register,login,addhostel,getDetails,myHostels,addRoom}=require("../Controller/managerController");
const router=express.Router();
router.post("/register",register);
router.post("/login",login);
router.post("/addhostel",addhostel);
router.get("/getdetails/:id",getDetails);
router.get("/myHostels/:email",myHostels);
router.get("/addroom/:id",addRoom);


module.exports=router;