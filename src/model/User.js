const {model, Schema} = require('mongoose');

const schema = new Schema({
    username: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
})

module.exports = model('User', schema);