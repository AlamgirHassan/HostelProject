const adminModel=require("../Models/AdminModel");
const bcrypt = require("bcryptjs");
const path = require('path');
const hostelModel=require('../Models/HostelModel');


const registerAdmin=async(req,res)=>{
    const image=req.files.image;
    const{name,email,address,phonenumber,cnic,password}=req.body;
    
    if(name===''||email===''||address===''||phonenumber===''||cnic===''||password==='')
    {
        return res.status(422).json({error:"Please upload all required data"});
    }
    else
    {
        try
        {
            const checkAdmin=await adminModel.findOne({email:email});
            if(checkAdmin)
            {
                return res.status(422).json({error:"Already registered"});
            }
            else
            {
                const image_url=email+"_"+image.name;
                const data=new adminModel({name:name,email:email,phoneNumber:phonenumber,idCardNumber:cnic,password:password,address:address,profileImageURL:image_url});
                const datasaved = await data.save();
                if(datasaved)
                {
                    let newpath = path.join(process.cwd(), 'Images/Admin_Profile_Images', image_url);
                    req.files.image.mv(newpath);
                    return res.status(201).json({message:"Admin registered successfully"});
                }
                else
                {
                    return res.status(422).json({error:"Admin registeration failed"});
                }
                
            }
        }
        catch(err)
        {
            console.log('Error : ',err);
        }
    }
  
}
const findAdmin= async (adminEmail) => {
    //Checking if user exists
    //If user exists he will send his details
    //Otherwise it will send null

    const userExist = await adminModel.findOne({ email: adminEmail });
    if (userExist) {

        return userExist;
    }
    else {
        return null;
    }

}
const loginAdmin=async(req,res)=>{
    const{email,password,cnic}=req.body;
    try
    {
        
        const data=await findAdmin(email);
        if(data!=null)
        {
            const checkpassword=password===data.password;
            const checkcnic=cnic===data.idCardNumber;
            
            if(!checkpassword || !checkcnic)
            {
                return res.status(422).json({error:"Invalid creaditionals"});
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
                    return res.status(201).json({ message:data});
            }
        }
        else
        {
            return res.status(422).json({error:"Invalid creaditionals"});
        }
    }
    catch(err)
    {
        console.log('Error : ',err);
    }
}

const getAdminData=async(req,res)=>{
    const email=req.params.email;
    const getData=await findAdmin(email);
    if(getData!=null)
    {
        return res.status(201).json({message:getData});
    }
    else
    {
        return res.status(422).json({error:"Admin not found"});
    }


}

const getUnverifiedHostels=async(req,res)=>{
    try
    {
        const getData=await hostelModel.find({isVerify:false});
        return res.status(201).json({message:getData});
    }
    catch(err)
    {
        console.log('Error : ',err);
    }
}
const getverifiedHostels=async(req,res)=>{
    try
    {
        const getData=await hostelModel.find({isVerify:true});
        return res.status(201).json({message:getData});
    }
    catch(err)
    {
        console.log('Error : ',err);
    }
}
const editHostelStatus=async(id,status)=>{

    try
    {
        const hostel=await hostelModel.findOne({_id:id});
        if(!hostel)
        {
            return null;
        }
        else
        {
            hostel.isVerify=status;
            hostel.save();
            return true;
        }
    }
    catch(err)
    {
        console.log('Error : ',err);
    }

}
const approveHotels=async(req,res)=>{
    const id=req.params.id;
    try
    {
        const hosteldata = await editHostelStatus(id,true);
        if(hosteldata!=null)
        {
            return res.status(201).json({message:"Hostel verified successfully"});
        }
        else
        {
            return res.status(422).json({err:"Hostel verification failed"});
        }
    }
    catch(err)
    {
        console.log('Error : ',err);
    }
}
const unapproveHotels=async(req,res)=>{
    const id=req.params.id;
    try
    {
        const hosteldata = await editHostelStatus(id,false);
        if(hosteldata!=null)
        {
            return res.status(201).json({message:"Hostel unverified successfully"});
        }
        else
        {
            return res.status(422).json({err:"Hostel unverification failed"});
        }
    }
    catch(err)
    {
        console.log('Error : ',err);
    }
}
module.exports = {
    register: registerAdmin,
    login:loginAdmin,
    getData:getAdminData,
    unVerifiedHostels:getUnverifiedHostels,
    approve:approveHotels,
    disapprove:unapproveHotels,
    verifiedHostels:getverifiedHostels



}