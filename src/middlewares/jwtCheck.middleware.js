require('dotenv').config()
const {verify} = require('jsonwebtoken')


const checkJWTSign = async (req, res, next) => {
    const {headers: {authorization}} = req


    if (authorization) {
        const token = authorization.split(' ')[1]

        verify(token, process.env.JWT_SECRET, (err) => {
            if (err) {
                return res.send(403).send({
                    message: 'Not Authorized'
                })
            }

            next()
        })

    }

    return res.status(403).send({
        message: 'Not Authorized'
    })
}


module.exports = {checkJWTSign}