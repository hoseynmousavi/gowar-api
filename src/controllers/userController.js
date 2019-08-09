import mongoose from 'mongoose'
import userModel from '../models/userModel'
import tokenHelper from '../functions/tokenHelper'

const user = mongoose.model('user', userModel)

const getUsers = (req, res) =>
{
    user.find({}, (err, users) =>
    {
        if (err) res.status(400).send(err)
        else res.send(users)
    })
}

const addNewUser = (req, res) =>
{
    const {phone, password} = req.body
    if (phone && phone.length === 11 && password && password.length >= 6)
    {
        delete req.body.created_date
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
    else res.status(400).send({message: 'please send a correct phone & password!'})
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
    if (phone && password && !isNaN(phone.length) && phone.length === 11 && password.length >= 6)
    {
        user.findOne({phone, password}, (err, takenUser) =>
        {
            if (err) res.status(400).send(err)
            else if (!takenUser) res.status(404).send({message: 'user not found!'})
            else
            {
                const user = takenUser.toJSON()
                tokenHelper.encodeToken(user)
                    .then((token) => res.send({...user, token}))
                    .catch((err) => res.status(500).send({message: err}))
            }
        })
    }
    else res.status(400).send({message: 'please send a correct phone & password!'})
}

const updateUserById = (req, res) =>
{
    // {new: true} means return new data after update
    user.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true, useFindAndModify: false}, (err, updatedUser) =>
    {
        if (err) res.status(400).send(err)
        else res.send(updatedUser)
    })
}

const deleteUserById = (req, res) =>
{
    user.deleteOne({_id: req.params.userId}, (err) =>
    {
        if (err) res.status(400).send(err)
        else res.send({message: 'user deleted successfully'})
    })
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