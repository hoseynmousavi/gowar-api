import eventController from "../controllers/eventController"

const eventRouter = (app) =>
{
    app.route("/event")
        .get(eventController.getEvents)
        .post(eventController.addNewEvent)
        .patch(eventController.updateEventById)

    app.route("/event/like")
        .post(eventController.addNewLike)

    app.route("/event/like/:eventId")
        .delete(eventController.deleteLike)

    app.route("/event/comment")
        .post(eventController.addNewComment)
        .patch(eventController.updateCommentById)

    app.route("/event/comment/:commentId")
        .get(eventController.getEventComments) // maybe confusing with get a specific comment
        .delete(eventController.deleteComment)

    app.route("/event/:eventId")
        .get(eventController.getEventById)
        .delete(eventController.deleteEventById)
}

export default eventRouter