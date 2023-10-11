const mongoose = require('mongoose');

const schema = mongoose.Schema({
    countId: {
        type: Number, // Corrected data type definition
    },
});

const realEstateData = mongoose.model('realEstateData', schema);
module.exports = realEstateData;
