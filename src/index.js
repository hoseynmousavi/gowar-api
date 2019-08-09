import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload'
import mongoose from 'mongoose'
import rootRouter from './routes/rootRouter'
import userRouter from './routes/userRouter'
import datePickerRouter from './routes/datePickerRouter'
import data from './data'
import addHeaderAndCheckPermissions from './functions/addHeaderAndCheckPermissions'

// Normal Things Never Leave Us Alone ...
const app = express()
app.use(cors())
app.use(fileUpload({}))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

mongoose.Promise = global.Promise
// mongoose.connect('mongodb://localhost:27017/amani', {useNewUrlParser: true})
mongoose.connect(data.connectDb, {useNewUrlParser: true})

// Add Header To All Responses & Token Things
addHeaderAndCheckPermissions(app)

// Routing Shits
rootRouter(app)
userRouter(app)
datePickerRouter(app)

// Eventually Run The Server
app.listen(data.port, () => console.log(`Backend is Now Running on Port ${data.port}`))
