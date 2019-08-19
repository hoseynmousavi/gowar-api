import mongoose from "mongoose"
import eventModel from "../models/eventModel"
import tokenHelper from "../functions/tokenHelper"

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
    let newEvent = new event(req.body)
    newEvent.save((err, createdEvent) =>
    {
        if (err) res.status(400).send(err)
        else
        {
            const event = createdEvent.toJSON()
            tokenHelper.encodeToken(event)
                .then((token) => res.send({...event, token}))
                .catch((err) => res.status(500).send({message: err}))
        }
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
    // {new: true} means return new data after update
    if (req.headers.authorization._id)
    {
        event.findOneAndUpdate({_id: req.headers.authorization._id}, req.body, {new: true, useFindAndModify: false}, (err, updatedEvent) =>
        {
            if (err) res.status(400).send(err)
            else res.send(updatedEvent)
        })
    }
    else res.status(500).send({message: "error"})
}

const deleteEventById = (req, res) =>
{
    event.deleteOne({_id: req.params.eventId}, (err) =>
    {
        if (err) res.status(400).send(err)
        else res.send({message: "event deleted successfully"})
    })
}

const eventController = {
    getEvents,
    addNewEvent,
    getEventById,
    updateEventById,
    deleteEventById,
}

export default eventController