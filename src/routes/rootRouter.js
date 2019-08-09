const rootRouter = (app) =>
{
    app.route('/')
        .get((req, res) => res.send('welcome to the api'))
}

export default rootRouter
