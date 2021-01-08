const router = require("express-promise-router")()


const { auth } = require("../controllers")

router.route('/').post(auth.login)
router.route('/signup').post(auth.signUp)

module.exports = router