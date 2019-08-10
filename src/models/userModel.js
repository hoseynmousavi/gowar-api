import mongoose from 'mongoose'

const model = mongoose.Schema

const userModel = new model({
    phone: {
        type: String,
        unique: true,
        minlength: 11,
        maxlength: 11,
        index: true,
        required: 'Enter Phone!',
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 30,
        required: 'Enter Password!',
    },
    name: {
        type: String,
    },
    birth_date: {
        type: String,
        minlength: 8,
        maxlength: 10,
    },
    email: {
        type: String,
        sparse: true, // means we can have many nulls :))
        unique: true,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default userModel
