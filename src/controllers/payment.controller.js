const dollarsToCents = require('dollars-to-cents')
const stripe = require('stripe')('sk_test_51I3Ij7IwOPLtMEtjsv06bMigAy8CPar14GFfQelxflm1QX5xKLCE1uT6EM3kc50vJRfwtLOEXVlGc1z3pBkDC3XZ00o7dBdRGb');

const createPaymentIntent = async ({body: {amount}}, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: dollarsToCents(amount),
            currency: 'usd',
            payment_method_types: ['card'],
        })

        return res.status(200).send(paymentIntent)
    } catch (e) {
        res.status(500).send(e)
    }
}

const stripeWebHook = async ({body}, res) =>{
    try {
        
    }catch (e) {
        
    }
}


module.exports = {
    createPaymentIntent
}