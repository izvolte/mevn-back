require('dotenv').config()
const {verify} = require('jsonwebtoken')


const checkJWTSign = async (req, res, next) => {
    const {headers: {authorization}} = req



    if (authorization) {
        const token = authorization.split(' ')[1]

        verify(token, process.env.JWT_SECRET, (err) => {
            if (err) {
                res.sendStatus(403)
                return next()
            }
        })
        return next()
    }


    res.sendStatus(403)
}


module.exports = {checkJWTSign}