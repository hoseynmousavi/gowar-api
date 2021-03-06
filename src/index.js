import cors from "cors"
import express from "express"
import bodyParser from "body-parser"
import fileUpload from "express-fileupload"
import mongoose from "mongoose"
import data from "./secure/data"
import rootRouter from "./routes/rootRouter"
import userRouter from "./routes/userRouter"
import eventRouter from "./routes/eventRouter"
import datePickerRouter from "./routes/datePickerRouter"
import notFoundRooter from "./routes/notFoundRouter"
import gateway from "./functions/gateway"

// Normal Things Never Leave Us Alone ...
const app = express()
app.use(cors())
app.use(fileUpload({}))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

mongoose.Promise = global.Promise
mongoose.connect(data.connectDb, {useNewUrlParser: true})

// Add Header To All Responses & Token Things
gateway(app)

// Routing Shits
rootRouter(app)
userRouter(app)
eventRouter(app)
datePickerRouter(app)
notFoundRooter(app)

// Eventually Run The Server
app.listen(data.port, () => console.log(`Backend is Now Running on Port ${data.port}`))
