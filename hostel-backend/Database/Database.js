const mongoose =require("mongoose");
const dotenv=require("dotenv");

dotenv.config({path:'./config.env'});

const db=process.env.DATABASE_URL;


mongoose.connect(db,{

    useNewUrlParser: true,

    useUnifiedTopology: true

}).then(()=>

{
    console.log('Connection Successfull with database')
})
.catch((err)=>
console.log("Problem in Connection", err)
)

module.exports = mongoose