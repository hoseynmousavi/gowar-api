import mongoose from "mongoose"

const model = mongoose.Schema

const userModel = new model({
    name: {
        type: String,
        required: "Enter Name!",
    },
    phone: {
        type: String,
        unique: true,
        minlength: 11,
        maxlength: 11,
        index: true,
        required: "Enter Phone!",
    },
    email: {
        type: String,
        sparse: true, // means we can have many nulls :))
        unique: true,
    },
    username: {
        type: String,
        sparse: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 30,
        required: "Enter Password!",
    },
    status: {
        type: String,
    },
    description: {
        type: String,
        maxlength: 500,
    },
    avatar: {
        type: String,
    },
    birth_date: {
        type: String,
        minlength: 8,
        maxlength: 10,
    },
    is_verified: {
        type: Boolean,
        default: false,
    },
    is_deleted: {
        type: Boolean,
        index: true,
        default: false,
    },
    created_date: {
        type: Date,
        default: Date.now(),
    },
})

export default userModel
