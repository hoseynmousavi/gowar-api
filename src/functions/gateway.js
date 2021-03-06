import tokenHelper from "./tokenHelper"

const gateway = (app) =>
{
    app.use((req, res, next) =>
    {
        res.setHeader("Access-Control-Allow-Origin", "*")
        if (
            (req.originalUrl === "/") ||
            (req.originalUrl === "/user" && (req.method === "POST" || req.method === "GET")) ||
            (req.originalUrl === "/user/login") ||
            (req.originalUrl === "/DatePicker")
        )
        {
            next()
        }
        else
        {
            if (req.headers.authorization)
            {
                tokenHelper.decodeToken(req.headers.authorization)
                    .then((payload) =>
                    {
                        req.headers.authorization = {...payload}
                        next()
                    })
                    .catch((err) => res.status(401).send(err))
            }
            else res.status(401).send({message: "send token!"})
        }
    })
}

export default gateway
