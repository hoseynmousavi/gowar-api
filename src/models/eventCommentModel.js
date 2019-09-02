import mongoose from "mongoose"

const schema = mongoose.Schema

const eventCommentModel = new schema({
    user_id: {
        type: schema.Types.ObjectId,
        required: "Enter user_id!",
    },
    event_id: {
        type: schema.Types.ObjectId,
        required: "Enter event_id!",
    },
    description: {
        type: String,
        minlength: 1,
        required: "Enter description!",
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

export default eventCommentModel