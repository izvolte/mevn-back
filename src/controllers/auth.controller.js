require('dotenv').config()
const jwt = require('jsonwebtoken')
const {User, Token} = require('../model')
const ACCESS_TOKEN_LIFE = '60m'

module.exports = {
    async logout({body: {refreshToken}}, res) {

        const foundToken = await Token.findOne({token: refreshToken})

        if (!foundToken) {
            return res.status(403).send({
                message: 'Пользователь не авторизован'
            })
        }

        await Token.findByIdAndDelete(foundToken._id)


        return res.status(200).send({
            message: 'Юзер успешно разлогинен'
        })
        //мы декадируем токен
        //вытаскиваем из токена юзер айди
        // по юзер ид находим рефреш токен
        // удаляем этот рефреш токен
    },
    async refreshToken({body: {refreshToken}}, res) {
        //проверяем есть ли токен в запросе на сервер
        if (!refreshToken) {
            return res.status(403).send({
                message: 'Действие запрещено'
            })
        }
        //ищем токен в бд
        const currentToken = await Token.findOne({token: refreshToken})
        //если не находим токен возвращаем ошибку
        if (!currentToken) {
            return res.status(403).send({
                message: 'Действие запрещено'
            })
        }

        jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH, (err, user) => {
            if (err) {
                return res.status(403).send({
                    message: 'Действие запрещено'
                })
            }


            const accessToken = jwt.sign({
                userId: user._id,
                email: user.email
            }, process.env.JWT_SECRET, {
                expiresIn: ACCESS_TOKEN_LIFE
            })

            console.log(accessToken)

            return res.status(200).send({
                accessToken,
                email: user.email
            })
        })
    },
    async login({body: {email, password}}, res) {
        try {
            const foundUser = await User.findOne({email})

            if (!foundUser) {
                return res.status(403).send({
                    message: 'Извините, логин или пароль не подходят!'
                })
            }

            // мы расшифровываем пароль из базы данных
            // сравниваем
            // TO_DO
            const isPasswordCurrent = foundUser.password === password


            if (!isPasswordCurrent) {
                return res.status(403).send({
                    message: 'Извините, логин или пароль не подходят!'
                })
            }

            const accessToken = jwt.sign({
                userId: foundUser._id,
                email: foundUser.email
            }, process.env.JWT_SECRET, {
                expiresIn: ACCESS_TOKEN_LIFE
            })

            const refreshToken = jwt.sign({
                userId: foundUser._id,
                email: foundUser.email
            }, process.env.JWT_SECRET_REFRESH)

            const foundToken = await Token.findOne({
                user: foundUser._id
            })

            if (foundToken) {
                await Token.findByIdAndUpdate(foundToken._id, {token: refreshToken})

                return res.status(200).send({
                    accessToken,
                    refreshToken,
                    email: foundUser.email
                })
            }

            const item = new Token({token: refreshToken, user: foundUser._id})
            await item.save()


            return res.status(200).send({
                accessToken,
                refreshToken,
                email: foundUser.email
            })

        } catch (e) {
            return res.status(403).send({
                message: 'Извините, логин или пароль не подходят!',
                e
            })
        }
    },
    async signUp({body: {email, password}}, res) {
        try {
            const foundUser = await User.findOne({email})
            if (foundUser) {
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