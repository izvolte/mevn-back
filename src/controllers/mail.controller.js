const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'Yandex',
    auth: {
        user: 'webmaster2@choosedesign.ru', // generated ethereal user
        pass: 'AVD*5sjFs@Bz', // generated ethereal password
    },
});


const sendMail = () => {

}

const createUserConfirmationOrderEmail = async ({_id, email}) => {

    const mail = await transporter.sendMail({
        from: `Choose delivery: webmaster2@choosedesign.ru `, // sender address
        to: email, // list of receivers
        subject: "Подтверждение заказа", // Subject line
        text: `Ваш заказ с номером ${_id} подтвержден`, // plain text body
        html: "<b>Hello world?</b>", // html body
    });


    console.log(mail)
    return mail

}
const createAdminConfirmationOrderEmail = async ({_id, phone, fullname, address}, email = 'mksepor@gmail.com') => {

    const mail = await transporter.sendMail({
        from: `Choose delivery: webmaster2@choosedesign.ru`, // sender address
        to: email, // list of receivers
        subject: `Создан заказ с номером ${_id}`, // Subject line
        text: `Ваш заказ с номером ${_id} подтвержден`, // plain text body
        html: `<h2>Новый заказ с номер ${_id}</h2>
    <p>Заказал ${fullname}</p>
    <p>Номер телефона ${phone}</p>
    <p>адресс ${address}</p>
`, // html body
    });

    console.log(mail)
    return mail

}


module.exports = {
    createUserConfirmationOrderEmail,
    createAdminConfirmationOrderEmail
}