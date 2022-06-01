const mongoose = require('mongoose')
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    idCardNumber:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true  
    },
    profileImageURL:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],

}, {
    timestamps: true,
})


//To decrypt Managers password
adminSchema.pre('save',async function(next)
{
    //if password is modified
    if(this.isModified('password'))
    {
        this.Password = await bcrypt.hash(this.password,12);
    }
    
    next();

});

adminSchema.methods.generateAuthToken = async function()
{
    try
    {
        let token = jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }
    catch(err)
    {
        console.log(err);
    }
}

const adminModel = mongoose.model('Admin', adminSchema);
module.exports = adminModel;
