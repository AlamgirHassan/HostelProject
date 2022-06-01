const express=require('express');
const dotenv=require('dotenv');
const cors = require('cors');
const cookieParser =require("cookie-parser");
const bodyParser = require('body-parser');
const mydb=require("./Database/Database");
const managerRoutes=require("./Routes/managerRoutes");
const fileupload=require('express-fileupload');
const adminRoutes=require("./Routes/adminRoutes");
const userRoutes=require('./Routes/userRoutes');


const app= express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors())
app.use(fileupload({
    useTempFiles:true
}));
app.use(cookieParser());
app.use(express.json()); 



app.use('/manager',managerRoutes);
app.use('/admin',adminRoutes);
app.use('/user',userRoutes);



app.get("/manager_profile_image/:path", (req, res) => {

    let file = req.params.path;
    
    const fileLocation = "./Images/Manager_Profile_Images/" + file;
    return res.sendFile(__dirname + "/" + fileLocation);
})
app.get("/admin_profile_image/:path", (req, res) => {

    let file = req.params.path;
    
    const fileLocation = "./Images/Admin_Profile_Images/" + file;
    return res.sendFile(__dirname + "/" + fileLocation);
})

app.get("/user_profile_image/:path", (req, res) => {

    let file = req.params.path;
    
    const fileLocation = "./Images/User_Profile_Images/" + file;
    return res.sendFile(__dirname + "/" + fileLocation);
})
app.get("/hostel_dp/:path",(req,res)=>{
    let file = req.params.path;
    
    const fileLocation = "./Images/Hostel_Images/" + file;
    return res.sendFile(__dirname + "/" + fileLocation);
})







dotenv.config({path:'./config.env'})
const port=process.env.PORTNO;
app.listen(port,()=>console.log(`server is up at PORT # ${port}`));