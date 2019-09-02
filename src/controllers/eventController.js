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
        else
        {
            for (let i = 0; i < events.length; i++)
            {
                eventLike.find({event_id: events[i]._id}, (err, likes) =>
                {
                    if (err) res.status(400).send(err)
                    else events[i] = {...events[i].toJSON(), likes_count: likes.length}
                    if (i === events.length - 1)
                    {
                        for (let j = 0; j < events.length; j++)
                        {
                            eventComment.find({event_id: events[j]._id, is_deleted: false}, (err, comments) =>
                            {
                                if (err) res.status(400).send(err)
                                else events[j] = {...events[j], comments_count: comments.length}
                                if (j === events.length - 1) res.send(events)
                            })
                        }
                    }
                })
            }
        }
    })
}

const addNewEvent = (req, res) =>
{
    delete req.body.created_date
    delete req.body.is_pinned
    delete req.body.is_deleted
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
        else
        {
            eventLike.find({event_id: takenEvent._id}, (err, likes) =>
            {
                if (err) res.status(400).send(err)
                else
                {
                    takenEvent = {...takenEvent.toJSON(), likes_count: likes.length}
                    eventComment.find({event_id: takenEvent._id, is_deleted: false}, (err, comments) =>
                    {
                        if (err) res.status(400).send(err)
                        else res.send({...takenEvent, comments_count: comments.length})
                    })
                }
            })
        }
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
            {new: true, useFindAndModify: false},
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
    newEventLike.save((err, createdEvent) =>
    {
        if (err) res.status(400).send(err)
        else res.send(createdEvent)
    })
}

const deleteLike = (req, res) =>
{
    eventLike.deleteOne({event_id: req.params.eventId, user_id: req.headers.authorization._id}, (err) =>
    {
        if (err) res.status(400).send(err)
        else res.send({message: "like deleted successfully"})
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
    newEventComment.save((err, createdEvent) =>
    {
        if (err) res.status(400).send(err)
        else res.send(createdEvent)
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
    eventComment.findOneAndUpdate(
        {_id: req.params.commentId, user_id: req.headers.authorization._id},
        {is_deleted: true},
        {new: true, useFindAndModify: false},
        (err) =>
        {
            if (err) res.status(400).send(err)
            else res.send({message: "comment deleted successfully"})
        },
    )
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