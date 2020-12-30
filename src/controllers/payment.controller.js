const dollarsToCents = require('dollars-to-cents')
const { Order } = require('../model')
const { sum } = require('ramda')
const stripe = require('stripe')('sk_test_51I3Ij7IwOPLtMEtjsv06bMigAy8CPar14GFfQelxflm1QX5xKLCE1uT6EM3kc50vJRfwtLOEXVlGc1z3pBkDC3XZ00o7dBdRGb');

const createPaymentIntent = async ({body: {fullname, address, phone, email, products}}, res) => {
    try {

        if(!address){
            throw new Error('Адрес обязателен')
        }

        const amount = sum(products.map(i => Number(i.amount)))

        const prepareOrder = {
            fullname, address, phone, email, products, amount
        }

        const newOrder = await new Order(prepareOrder)
        const saveOrder = newOrder.save()

        const paymentIntent = await stripe.paymentIntents.create({
            amount: dollarsToCents(amount),
            currency: 'usd',
            payment_method_types: ['card'],
        })

        return res.status(200).send({
            paymentIntent,
            saveOrder
        })
    } catch (e) {
        res.status(500).send(e)
    }
}

const stripeWebHook = async ({body}, res) =>{
    try {
        console.log(body)
    }catch (e) {
        res.status(500).send(e)
    }
}


module.exports = {
    createPaymentIntent
}