import mongoose from "mongoose"
import eventModel from "../models/eventModel"
import eventLikeModel from "../models/eventLikeModel"
import eventCommentModel from "../models/eventCommentModel"

const event = mongoose.model("event", eventModel)
const eventLike = mongoose.model("eventLike", eventLikeModel)
const eventComment = mongoose.model("eventComment", eventCommentModel)

const getEvents = (req, res) =>
{
    event.find({is_deleted: false}, (err, events) =>
    {
        if (err) res.status(400).send(err)
        else res.send(events)
    })
}

const addNewEvent = (req, res) =>
{
    delete req.body.created_date
    delete req.body.is_pinned
    delete req.body.is_deleted
    delete req.body.likes_count
    delete req.body.comments_count
    req.body.creator_id = req.headers.authorization._id
    req.body.category ? req.body.category = JSON.parse(req.body.category) : null
    let newEvent = new event(req.body)
    newEvent.save((err, createdEvent) =>
    {
        if (err) res.status(400).send(err)
        else res.send(createdEvent)
    })
}

const getEventById = (req, res) =>
{
    event.findById(req.params.eventId, (err, takenEvent) =>
    {
        if (err) res.status(400).send(err)
        else res.send(takenEvent)
    })
}

const updateEventById = (req, res) =>
{
    if (req.headers.authorization._id)
    {
        delete req.body.created_date
        delete req.body.is_pinned
        delete req.body.is_deleted
        delete req.body.creator_id
        delete req.body.likes_count
        delete req.body.comments_count
        req.body.category ? req.body.category = JSON.parse(req.body.category) : null
        event.findOneAndUpdate(
            {_id: req.body._id, creator_id: req.headers.authorization._id, is_deleted: false},
            req.body,
            {new: true, useFindAndModify: false},
            (err, updatedEvent) =>
            {
                if (err) res.status(400).send(err)
                else res.send(updatedEvent)
            },
        )
    }
    else res.status(500).send({message: "auth error"})
}

const deleteEventById = (req, res) =>
{
    if (req.headers.authorization._id)
    {
        event.findOneAndUpdate(
            {_id: req.params.eventId, creator_id: req.headers.authorization._id},
            {is_deleted: true},
            {useFindAndModify: false},
            (err) =>
            {
                if (err) res.status(400).send(err)
                else res.send({message: "event deleted successfully"})
            },
        )
    }
    else res.status(500).send({message: "auth error"})
}

const addNewLike = (req, res) =>
{
    delete req.body.created_date
    req.body.user_id = req.headers.authorization._id
    const newEventLike = new eventLike(req.body)
    newEventLike.save((err, createdLike) =>
    {
        if (err) res.status(400).send(err)
        else
        {
            event.findOneAndUpdate(
                {_id: req.body.event_id, creator_id: req.headers.authorization._id},
                {$inc: {likes_count: 1}},
                {useFindAndModify: false},
                (err) =>
                {
                    if (err) res.status(400).send(err)
                    else res.send(createdLike)
                },
            )
        }
    })
}

const deleteLike = (req, res) =>
{
    eventLike.deleteOne({event_id: req.params.eventId, user_id: req.headers.authorization._id}, (err, statistic) =>
    {
        if (err) res.status(400).send(err)
        else if (statistic.deletedCount === 1)
        {
            event.findOneAndUpdate(
                {_id: req.params.eventId, creator_id: req.headers.authorization._id},
                {$inc: {likes_count: -1}},
                {useFindAndModify: false},
                (err) =>
                {
                    if (err) res.status(400).send(err)
                    else res.send({message: "like deleted successfully"})
                },
            )
        }
        else res.status(404).send({message: "like not found!"})
    })
}

const getEventComments = (req, res) =>
{
    eventComment.find({is_deleted: false, event_id: req.params.commentId}, (err, events) =>
    {
        if (err) res.status(400).send(err)
        else res.send(events)
    })
}

const addNewComment = (req, res) =>
{
    delete req.body.created_date
    req.body.user_id = req.headers.authorization._id
    const newEventComment = new eventComment(req.body)
    newEventComment.save((err, createdComment) =>
    {
        if (err) res.status(400).send(err)
        else
        {
            event.findOneAndUpdate(
                {_id: req.body.event_id, creator_id: req.headers.authorization._id},
                {$inc: {comments_count: 1}},
                {useFindAndModify: false},
                (err) =>
                {
                    if (err) res.status(400).send(err)
                    else res.send(createdComment)
                },
            )
        }
    })
}

const updateCommentById = (req, res) =>
{
    eventComment.findOneAndUpdate(
        {_id: req.body.comment_id, user_id: req.headers.authorization._id, is_deleted: false},
        {description: req.body.description},
        {new: true, useFindAndModify: false, runValidators: true},
        (err, updatedComment) =>
        {
            if (err) res.status(400).send(err)
            else res.send(updatedComment)
        },
    )
}

const deleteComment = (req, res) =>
{
    eventComment.findOne({_id: req.params.commentId, user_id: req.headers.authorization._id, is_deleted: false}, (err, takenComment) =>
    {
        if (err) res.status(400).send(err)
        else if (!takenComment) res.status(404).send({message: "comment not found!"})
        else
        {
            eventComment.findOneAndUpdate(
                {_id: req.params.commentId, user_id: req.headers.authorization._id},
                {is_deleted: true},
                {useFindAndModify: false},
                (err) =>
                {
                    if (err) res.status(400).send(err)
                    else
                    {
                        event.findOneAndUpdate(
                            {_id: takenComment.event_id, creator_id: req.headers.authorization._id},
                            {$inc: {comments_count: -1}},
                            {useFindAndModify: false},
                            (err) =>
                            {
                                if (err) res.status(400).send(err)
                                else res.send({message: "comment deleted successfully"})
                            },
                        )
                    }
                },
            )
        }
    })
}

const eventController = {
    getEvents,
    addNewEvent,
    getEventById,
    updateEventById,
    deleteEventById,
    addNewLike,
    deleteLike,
    getEventComments,
    addNewComment,
    deleteComment,
    updateCommentById,
}

export default eventController