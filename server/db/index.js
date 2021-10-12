const mongoose = require('mongoose');

const { dbUrl } = require('../config');

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then((response) => {
        console.log('Connected to mongodb');
    })
    .catch((Err) => {
        console.log('Error Connecting to mongo db');
    });

module.exports = mongoose;
