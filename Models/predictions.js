const mongoose = require('mongoose');

const schema = mongoose.Schema({
    day: {
        type: String,
        required: true
    },
    firstTeam: {
        type: String,
        required: true
    },
    league: {
        type: String,
        required: true
    },
    odds: {
        type: String,
        required: true
    },
    secondTeam: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    tip: {
        type: String,
        required: true
    },
    img: {
        type: String,
    }
});

const adminPredictions = mongoose.model('adminPredictions', schema);
module.exports = adminPredictions;
