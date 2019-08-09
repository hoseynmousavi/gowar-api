import mongoose from 'mongoose'

const model = mongoose.Schema

const userModel = new model({
    phone: {
        type: String,
        unique: true,
        required: 'Enter Phone!',
    },
    password: {
        type: String,
        required: 'Enter Password!',
    },
    name: {
        type: String,
    },
    birth_date: {
        type: String,
    },
    email: {
        type: String,
        sparse: true, // means we can have many nulls :))
        unique: true,
    },
    created_date: {
        type: Date,
        default: new Date(),
    },
})

export default userModel
