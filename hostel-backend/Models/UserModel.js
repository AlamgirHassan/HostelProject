const mongoose = require('mongoose')
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
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
    bookings:[
        {
            hostelEmail:{
                type:String,
                required:true
            }
        }
    ],
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

userSchema.pre('save',async function(next)
{
    //if password is modified
    if(this.isModified('password'))
    {
        this.password = await bcrypt.hash(this.password,12);
    }
    next();

});

userSchema.methods.generateAuthToken = async function()
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

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;

