import eventController from "../controllers/eventController"

const eventRouter = (app) =>
{
    app.route("/event")
        .get(eventController.getEvents)
        .post(eventController.addNewEvent)
        .patch(eventController.updateEventById)

    app.route("/event/:eventId")
        .get(eventController.getEventById)
        .delete(eventController.deleteEventById)
}

export default eventRouter