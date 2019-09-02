import mongoose from "mongoose"

const schema = mongoose.Schema

const eventLikeModel = new schema({
    user_id: {
        type: schema.Types.ObjectId,
        required: "Enter user_id!",
    },
    event_id: {
        type: schema.Types.ObjectId,
        required: "Enter event_id!",
    },
    created_date: {
        type: Date,
        default: Date.now(),
    },
})

eventLikeModel.index({user_id: 1, event_id: 1}, {unique: true})

export default eventLikeModel