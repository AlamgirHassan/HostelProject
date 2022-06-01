const mongoose = require('mongoose')
const locationSchema = new mongoose.Schema({
    CityName: {
        type: String,
        required: true,
        unique:true
    }
})

const locationModel = mongoose.model('Location', locationSchema);
module.exports = locationModel;