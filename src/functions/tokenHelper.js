import jwt from "jsonwebtoken"
import data from "../secure/data"
import hashHelper from "../secure/hashHelper"

const encodeToken = (payload) =>
{
    return new Promise((resolve, reject) =>
        jwt.sign(payload, data.sign, {algorithm: "HS512"}, (err, token) =>
        {
            if (err)
            {
                reject(err)
            }
            else
            {
                resolve(hashHelper.createHash(token))
            }
        }),
    )
}

const decodeToken = (token) =>
{
    return new Promise((resolve, reject) =>
        jwt.verify(hashHelper.deleteHash(token), data.sign, {algorithm: "HS512"}, (err, payload) =>
        {
            if (err) reject(err)
            else resolve(payload)
        }),
    )
}

const tokenHelper = {
    encodeToken,
    decodeToken,
}

export default tokenHelper
