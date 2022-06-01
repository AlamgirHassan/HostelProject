const userModel = require("../Models/UserModel");
const hostelModel = require("../Models/HostelModel");

const bcrypt = require("bcryptjs");
const path = require('path');

const registerUser = async (req, res) => {

    const image = req.files.image;
    const { name, email, password } = req.body;
    if (name === '' || email === '' || password === '') {
        return res.status(422).json({ error: "Please fill all required details" });
    }
    else {
        try {
            const checkUser = await userModel.findOne({ email: email });
            if (checkUser) {
                return res.status(422).json({ error: "Email already registered" });
            }
            else {
                const img_src = email + '_' + image.name;
                const data = new userModel({ name: name, password: password, email: email, profileImageURL: img_src });
                const datasaved = await data.save();
                if (datasaved) {
                    let newpath = path.join(process.cwd(), 'Images/User_Profile_Images', img_src);
                    req.files.image.mv(newpath);
                    return res.status(201).json({ message: "User registered successfully" });
                }
                else {
                    return res.status(422).json({ error: "User registeration failed" });
                }
            }
        }
        catch (err) {
            console.log('Error : ', err);
        }
    }

}
const findUser = async (email) => {
    try
    {   
        const userExist = await userModel.findOne({ email: email });
        if (userExist) {
    
            return userExist;
        }
        else {
            return null;
        }
    }catch(err)
    {
        console.log('Error : ',err);
    }

}
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (email === '' || password === '') {
        return res.status(422).json({ error: "Please fill all required details" });
    }
    else {
        try
        {
            const data=await findUser(email);
            if(data!=null)
            {
                const isMatch = await bcrypt.compare(password, data.password);
                if(!isMatch)
                {
                    return res.status(422).json({ error: "Invalid Credentials" });
                }
                else
                {
                    const token = await data.generateAuthToken();
                    //creating cookie and setting expire in 45 minutes in milliseconds
                    //jwt is name of cookie
                    res.cookie("jwt", token, {
                        expires: new Date(Date.now() + 2700000),
                        httpOnly: true
                    });

                    return res.status(201).json({message:data});
                }
            }
            else
            {
                return res.status(422).json({ error: "Invalid Credentials" });
            }
        }catch(err)
        {
            console.log('Error : ',err);

        }
    }
}

const getHostels=async(req,res)=>{

    const{city,status,rooms}=req.body;
    console.log("Body : ",req.body);
    try
    {
        const data=await hostelModel.find({hostelCity:city,hostelCategory:status,hostelEmptyRooms:{ "$gte":rooms  }}); 
        if(data)
        {
            return res.status(422).json({message:data});
        }
        else
        {
            return res.status(422).json({message:"Hostel not found"});
        }
    }
    catch(err)
    {
        console.log('Error : ',err);
    }

}

module.exports = {
    register: registerUser,
    login: loginUser,
    hostelsList:getHostels,


}