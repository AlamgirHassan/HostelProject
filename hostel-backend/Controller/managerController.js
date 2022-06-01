const managerModel = require("../Models/ManagerModel");
const hostelModel = require("../Models/HostelModel");
const locationModel=require('../Models/LocationModel');
const bcrypt = require("bcryptjs");
const path = require('path');
const registerManager = async (req, res) => {


    //Get Image from files
    if (!req.files.cnic_front && !req.files.cnic_back && !req.files.profile_image) {
        console.log("Files are not uploaded");
        return res.status(422).json({ error: "Files are not uploaded" });
    }
    else {
        var cnicFrontURL = req.files.cnic_front;
        var cnicBackURL = req.files.cnic_back;
        var profileURL = req.files.profile_image;

    }
    //Getting all required details from body
    const { managerName, managerEmail, managerPhoneNumber, managerIDCardNumber, managerPassword } = req.body;
    //Checking if user has given all required details
    if (managerName === '' || managerEmail === '' || managerPhoneNumber === '' || managerIDCardNumber === '' || managerPassword === '') {
        console.log("Please fill all required details");
        return res.status(422).json({ error: "Please fill all required details" });
    }
    else {



        try {
            //Checking if email already exist
            const userExist = await managerModel.findOne({ email: managerEmail });
            if (userExist) {
                return res.status(422).json({ error: "User already exist" })
                //const err = new Error("User Already Exist");
                //throw err;
            }
            else {
                //Getting images names
                const frontImageURL = managerEmail + "_" + "FrontImage" + "_" + cnicFrontURL.name;
                const backImageURL = managerEmail + "_" + "BackImage" + "_" + cnicBackURL.name;
                const profileImageURL = managerEmail + "_" + profileURL.name;

                //Saving data
                const user = new managerModel({ name: managerName, email: managerEmail, phoneNumber: managerPhoneNumber, idCardNumber: managerIDCardNumber, password: managerPassword, frontIDCardURL: frontImageURL, backIDCardURL: backImageURL, profileImageURL: profileImageURL });
                const datasaved = await user.save();
                if (datasaved) {
                    //After saving data moving images to respective folders
                    let newpath = path.join(process.cwd(), 'Images/Manager_CNIC_Images', frontImageURL);
                    req.files.cnic_front.mv(newpath);
                    newpath = path.join(process.cwd(), 'Images/Manager_CNIC_Images', backImageURL);
                    req.files.cnic_back.mv(newpath);
                    newpath = path.join(process.cwd(), 'Images/Manager_Profile_Images', profileImageURL);
                    req.files.profile_image.mv(newpath);
                    return res.status(201).json({ message: "Manager registeration successful" });
                }
                else {
                    return res.status(422).json({ error: "Manager registeration failed" })
                    //const err = new Error("Manager registeration failed");
                    //throw err;
                }
            }
        }
        catch (err) {
            console.log(err);
            //res.status(422).json({ error: err })
        }
    }
}
const findManager = async (managerEmail) => {
    //Checking if user exists
    //If user exists he will send his details
    //Otherwise it will send null

    const userExist = await managerModel.findOne({ email: managerEmail });
    if (userExist) {

        return userExist;
    }
    else {
        return null;
    }

}
const loginManager = async (req, res) => {
    //Getting required details from body
    const { managerEmail, managerIDCardNumber, managerPassword } = req.body;
    //Checking if user has given all required details
    if (managerEmail === '' || managerIDCardNumber === '' || managerPassword === '') {
        console.log("Please fill all required details");
        return res.status(422).json({ error: "Please fill all required details" });
    }
    else {
        try {

            const userExist = await findManager(managerEmail);

            if (userExist != null) {
                //If user exist, it will decrypt saved password and will compare it current given password
                const isMatch = await bcrypt.compare(managerPassword, userExist.password);
                //Checking if CNIC given matches with saved CNIC
                const checkcnic = userExist.idCardNumber === managerIDCardNumber;
                if (!isMatch && !checkcnic) {
                    //If password do not match with encrypted password
                    return res.status(422).json({ error: "Invalid Credentials" });
                    //const err=new Error("Invalid Credentials");
                    //throw err;

                }
                else {
                    //If both conditions are true, it will generate a token
                    const token = await userExist.generateAuthToken();
                    //creating cookie and setting expire in 45 minutes in milliseconds
                    //jwt is name of cookie
                    res.cookie("jwt", token, {
                        expires: new Date(Date.now() + 2700000),
                        httpOnly: true
                    });
                    return res.status(201).json({ message: userExist });
                }
            }
            else {
                console.log("User Email not found");
                return res.status(422).json({ error: "Invalid Credentials" });
                //const err=new Error("Invalid Credentials");
                //throw err;
            }
        }
        catch (err) {
            //return res.status(422).json({error:err});
        }
    }

}
const addNewCity=async(cityName)=>{

    try
    {
        const isdata=await locationModel.findOne({CityName:cityName});
        if(!isdata)
        {
            const location = new locationModel({CityName:cityName});
            const issaved=await location.save();
            if(issaved)
            {
                return "Location Added";
            }
            else
            {
                console.log('Error : ',error);
            }
        }
        else
        {
            return "Already Added";
        }
    }
    catch(err)
    {
        console.log('Error : ',err);
    }
    
}
const addHostel = async (req, res) => {
    const { title, description, price, address, city, area, areasize, totalrooms, emptyrooms, kitchen, gym, laundry, mediaroom, backyard, parking, frontyard,
        hotbath, pool, centralair, electricity, naturalgas, ventilation, water, elevator, fireplace, wifi, managerEmail } = req.body;
    const firstimage = req.files.firstimage;
    const secondimage = req.files.secondimage;
    const thirdimage = req.files.thirdimage;

    if (title === '' || description === '' || price === '' || address === '' || city === '' || areasize === '' || totalrooms === '' || emptyrooms === '' || area === '') {
        console.log("Please fill all required details");
        return res.status(422).json({ error: "Please fill all required details" });
    }
    else {
        const checkuser = await findManager(managerEmail);


        var images = [];
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);

        // current month
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        // current year
        let year = date_ob.getFullYear();
        // current hours
        let hours = date_ob.getHours();
        // current minutes
        let minutes = date_ob.getMinutes();
        // current seconds
        let seconds = date_ob.getSeconds();
        var url = managerEmail + "_" + hours+"-"+minutes+"-"+seconds+"-"+date+'-'+'-'+month+'-'+year+"_"+firstimage.name;
        images.push(url)
        url = managerEmail +"_" + hours+"-"+minutes+"-"+seconds+"-"+date+'-'+'-'+month+'-'+year+"_"+secondimage.name;
        images.push(url)
        url = managerEmail +"_" + hours+"-"+minutes+"-"+seconds+"-"+date+'-'+'-'+month+'-'+year+"_"+thirdimage.name;
        images.push(url)
        if (checkuser !== null) {
            try {
                const hostel = new hostelModel({
                    hostelTitle: title, hostelDescription: description, hostelPrice: price, hostelEmail: managerEmail,hostelCategory:"Hostel",
                    hostelImages: images, hostelAddress: address, hostelCity: city, hostelArea: area, hostelSize: areasize[0], hostelTotalRooms: parseInt(totalrooms),
                    hostelEmptyRooms: parseInt(emptyrooms), isKitchen: kitchen, isGym: gym, isLaundry: laundry, isMediaRoom: mediaroom, isBackyard: backyard, isFrontyard: frontyard,
                    isParking: parking, isHotbath: hotbath, isPool: pool, isCentralAir: centralair, isElectricity: electricity, isNaturalGas: naturalgas, isVentilation: ventilation,
                    isWater: water, isElevator: elevator, isFireplace: fireplace, isWifi: wifi
                })
                const datasaved = await hostel.save();
                if (datasaved) {
                    console.log(images[0])
                    let newpath = path.join(process.cwd(), 'Images/Hostel_Images', images[0]);
                    req.files.firstimage.mv(newpath);
                    newpath = path.join(process.cwd(), 'Images/Hostel_Images', images[1]);
                    req.files.secondimage.mv(newpath);
                    newpath = path.join(process.cwd(), 'Images/Hostel_Images', images[2]);
                    req.files.thirdimage.mv(newpath);
                    console.log("Hostel registered successfully");
                    await addNewCity(city);
                    return res.status(201).json({ message: "Hostel registeration successful" });
                }
            } catch (err) {
                console.log("Error : ", err);
            }

        }
        else {
            console.log("Hostel registeration failed");
            return res.status(422).json({ error: "Hostel registeration failed" });
        }

    }


}


const getHostelDetails=async(req,res)=>{
    
    const id=req.params.id;
    console.log("ID : ",id);
    try
    {
        const getdata=await hostelModel.findOne({_id:id});
        if(!getdata)
        {
            return res.status(422).json({error:"Hostel data not found"});
        }
        else
        {
            return res.status(201).json({message:getdata});
        }
    }
    catch(err)
    {
        console.log('Error : ',err);
    }
}

const getMyHostels=async(req,res)=>{
    const email=req.params.email;
    

    try
    {
        const checkuser=await findManager(email);
        if(checkuser===null)
        {
            return res.status(422).json({error:"Manager not found"});
        }
        else
        {
            const hostelsData=await hostelModel.find({hostelEmail:email});
            return res.status(201).json({message:hostelsData});
        }
    }
    catch(err)
    {
        console.log("Error : ",err);
    }
}
const addHostelRoom=async(req,res)=>{
    const id=req.params.id;
    console.log("Hostel ID : ",id);
    try
    {
        const data=await hostelModel.findOne({_id:id});
        if(!data)
        {
            return res.status(422).json({error:"Hostel not found"});
        }
        else
        {
            let roomsTotal=parseInt(data.hostelTotalRooms);
            let roomsAvailable=parseInt(data.hostelEmptyRooms);
            roomsTotal=roomsTotal+1;
            roomsAvailable=roomsAvailable+1;

            data.hostelTotalRooms=roomsTotal;
            data.hostelEmptyRooms=roomsAvailable;
            data.save();
            console.log("Rooms Available : ",data.hostelEmptyRooms);
            console.log("Total Rooms : ",data.hostelTotalRooms);
            
            return res.status(201).json({message:"Hostel Rooms uploaded successfully"});
        }
    }
    catch(err)
    {
        console.log('Error : ',err);
    }
}


module.exports = {
    register: registerManager,
    login: loginManager,
    addhostel: addHostel,
    getDetails:getHostelDetails,
    myHostels:getMyHostels,
    addRoom:addHostelRoom,


}