import mongoose from "mongoose"

const model = mongoose.Schema

const eventModel = new model({
    name: {
        type: String,
        required: "Enter Name!",
    },
    description: {
        type: String,
    },
    category: [{
        type: Number,
        index: true,
    }],
    location: {
        type: String,
        required: "Enter Location!",
    },
    duration: {
        type: String,
        required: "Enter Duration!",
    },
    date: {
        type: String,
        required: "Enter Date!",
    },
    creator_id: {
        type: String,
        required: "Enter Creator Id!",
    },
    is_pinned: {
        type: Boolean,
        default: false,
    },
    coin_limit: {
        type: Number,
    },
    gender_limit: {
        type: String,
    },
    age_limit: {
        type: Number,
    },
    is_deleted: {
        type: Boolean,
        index: true,
        default: false,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default eventModel
