import mongoose from "mongoose"
import userModel from "../models/userModel"
import tokenHelper from "../functions/tokenHelper"

const user = mongoose.model("user", userModel)

const getUsers = (req, res) =>
{
    user.find({is_deleted: false}, (err, users) =>
    {
        if (err) res.status(400).send(err)
        else res.send(users)
    })
}

const addNewUser = (req, res) =>
{
    delete req.body.created_date
    delete req.body.type
    delete req.body.is_verified
    delete req.body.is_deleted
    let newUser = new user(req.body)
    newUser.save((err, createdUser) =>
    {
        if (err) res.status(400).send(err)
        else
        {
            const user = createdUser.toJSON()
            tokenHelper.encodeToken(user)
                .then((token) => res.send({...user, token}))
                .catch((err) => res.status(500).send({message: err}))
        }
    })
}

const getUserById = (req, res) =>
{
    user.findById(req.params.userId, (err, takenUser) =>
    {
        if (err) res.status(400).send(err)
        else res.send(takenUser)
    })
}

const userLogin = (req, res) =>
{
    const phone = req.body.phone
    const password = req.body.password
    if (phone && !isNaN(phone))
    {
        user.findOne({phone, password}, (err, takenUser) =>
        {
            if (err) res.status(400).send(err)
            else if (!takenUser) res.status(404).send({message: "user not found!"})
            else
            {
                const user = takenUser.toJSON()
                tokenHelper.encodeToken(user)
                    .then((token) => res.send({...user, token}))
                    .catch((err) => res.status(500).send({message: err}))
            }
        })
    }
    else res.status(400).send({message: "please send a correct phone!"})
}

const updateUserById = (req, res) =>
{
    // {new: true} means return new data after update
    if (req.headers.authorization._id)
    {
        delete req.body.type
        delete req.body.created_date
        delete req.body.is_verified
        delete req.body.is_deleted
        user.findOneAndUpdate({_id: req.headers.authorization._id}, req.body, {new: true, useFindAndModify: false}, (err, updatedUser) =>
        {
            if (err) res.status(400).send(err)
            else res.send(updatedUser)
        })
    }
    else res.status(500).send({message: "auth error"})
}

const deleteUserById = (req, res) =>
{
    if (req.headers.authorization._id)
    {
        user.findOneAndUpdate(
            {_id: req.headers.authorization._id},
            {is_deleted: true},
            {new: true, useFindAndModify: false},
            (err, updatedUser) =>
            {
                if (err) res.status(400).send(err)
                else res.send(updatedUser)
            })
    }
    else res.status(500).send({message: "auth error"})
}

const userController = {
    getUsers,
    addNewUser,
    getUserById,
    userLogin,
    updateUserById,
    deleteUserById,
}

export default userController