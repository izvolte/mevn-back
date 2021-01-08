require('dotenv').config()
const jwt = require('jsonwebtoken')
const { omit } = require('ramda')
const { User } = require('../model')

module.exports = {
    async login({body: {email, password}}, res){
        try {
            const foundUser = await User.findOne({email})

            if(!foundUser){
                return res.status(403).send({
                    message: 'Извините, логин или пароль не подходят!'
                })
            }

            // мы расшифровываем пароль из базы данных
            // сравниваем
            // TO_DO
            const isPasswordCorrent = foundUser.password === password


            if(!isPasswordCorrent){
                return res.status(403).send({
                    message: 'Извините, логин или пароль не подходят!'
                })
            }

            const accessToken = jwt.sing({
                userId: foundUser._id,
                email: foundUser.email
            }, process.env.JWT_SECRET)


            return res.status(200).send({
                accessToken,
                ...omit(['password'], foundUser)
            })
        } catch (e) {
            return res.status(403).send({
                message: 'Извините, логин или пароль не подходят!',
                e
            })
        }
    },
    async signUp({ body: {email, password}}, res){
        try {
            const foundUser = await User.findOne({email})
            if(foundUser){
                
                return res.status(403).send({
                    message: 'Данный email занят'
                })
            }

            const createdUser = await new User({email, password})
            await createdUser.save()


            return res.status(200).send({
                message: "Пользовтель создан"
            })

            //сделать емейл о удачной регистрации
        } catch (e) {
            return res.status(403).send({
                message: 'Извините, логин или пароль не подходят!',
                e
            })
        }
    }
}