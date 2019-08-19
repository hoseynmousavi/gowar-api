import mongoose from "mongoose"
import eventModel from "../models/eventModel"

const event = mongoose.model("event", eventModel)

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
        req.body.category ? req.body.category = JSON.parse(req.body.category) : null
        event.findOneAndUpdate(
            {_id: req.body._id, creator_id: req.headers.authorization._id},
            req.body,
            {new: true, useFindAndModify: false},
            (err, updatedEvent) =>
            {
                if (err) res.status(400).send(err)
                else res.send(updatedEvent)
            })
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
            (err, updatedEvent) =>
            {
                if (err) res.status(400).send(err)
                else res.send(updatedEvent)
            })
    }
    else res.status(500).send({message: "auth error"})
}

const eventController = {
    getEvents,
    addNewEvent,
    getEventById,
    updateEventById,
    deleteEventById,
}

export default eventController