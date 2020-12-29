const {model, Schema, Schema: {Types: {ObjectId}}} = require('mongoose');

const schema = new Schema({
    title: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: ''
    },
    props: {
        type: Object,
        default: {
            color: "red"
        }
    },
    products: [
        {
            type: ObjectId,
            ref: 'Product'
        }
    ],
})

module.exports = model('Category', schema);