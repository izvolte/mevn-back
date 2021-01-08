require('dotenv').config()
const {verify} = require('jsonwebtoken')


const checkJWTSign = async (req, res, next) => {
    const { header: { authorization } } = req
    if (authorization) {
        const token = authorization.split(' ')[1]

        verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err){
                return res.send(403).send({
                    message: 'Not Authorized'
                })
            }

            req.user = user
            next();
        })
    }

    return res.status(403).send({
        message: 'Not Authorized'
    })
}


module.exports = checkJWTSign