const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactsSchema = new Schema({
    first_name: String,
    last_name: String,
    address: String,
    email_address: {
        type: String,
        unique: true,
    },
    contact_number: {
        type: String,
        unique: true,
    },
});

module.exports = mongoose.model('Contact', contactsSchema);