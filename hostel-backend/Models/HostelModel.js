const mongoose = require('mongoose')
const hostelSchema = new mongoose.Schema({
    hostelTitle: {
        type: String,
        required: true
    },
    hostelDescription:{
        type:String,
        required:true
    },
    hostelEmail:{
        type:String,
        required:true
    },
    hostelPrice:{
        type:String,
        required:true
    },
    hostelCategory:{
        type:String,
        required:true
    },

    hostelImages : [{
        type: String,
        
    }],
    hostelAddress:{
        type:String,
        required:true
    },
    hostelCity:{
        type:String,
        required:true
    },
    hostelArea:{
        type:String,
        required:true
    },
    hostelSize:{
        type:String,
        required:true
    },
    hostelTotalRooms:{
        type:Number,
        required:true
    },
    hostelEmptyRooms:{
        type:Number,
        required:true
    },
    
    isKitchen:{
        type:Boolean
    },
    isGym:{
        type:Boolean
    },
    isLaundry:{
        type:Boolean
    },
    isMediaRoom:{
        type:Boolean
    },
    isBackyard:{
        type:Boolean
    },
    isFrontyard:{
        type:Boolean
    },
    isParking:{
        type:Boolean
    },
    isHotbath:{
        type:Boolean
    },
    isPool:{
        type:String
    },
    isCentralAir:{
        type:Boolean
    },
    isElectricity:{
        type:Boolean
    },
   
    isNaturalGas:{
        type:Boolean
    },
    isVentilation:{
        type:Boolean
    },
    isWater:{
        type:Boolean
    },
    isElevator:{
        type:Boolean
    },
    isFireplace:{
        type:Boolean
    },
    isWifi:{
        type:Boolean
    },
    isVerify:{
        type:Boolean,
        default:false
    }

}, {
    timestamps: true,
})


const hostelModel = mongoose.model('Hostel', hostelSchema);
module.exports = hostelModel;