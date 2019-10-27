const { Schema, model } = require('mongoose');

const expanseSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: [4, 'Title should be at least 4 characters!'],
    },
    description: {
        type: String,
        required: true,
        minlength: [20, 'Description should be at least 20 characters!'],
        maxlength: [50, 'Description should be less than 50 characters!'],
    },
    category: {
        type: String,
        required: true

    },
    total:{
        type: Number,
        required:true
    },
    isReported: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date || String,
        required: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = model('Expanse', expanseSchema);