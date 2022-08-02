const router = require('express').Router()
const {
	if_auth_next,
	if_not_auth_next
} = require('../helpers/auth.helpers')
const {
	render_log_in,
	log_in,
	render_sign_in,
	sign_in,
	log_out
} = require('../controllers/log_in.controllers')




// Log in

router.get('/log_in', if_not_auth_next, render_log_in)
router.post('/log_in', if_not_auth_next, log_in)


// Sign in

router.get('/sign_in', if_not_auth_next, render_sign_in)
router.post('/sign_in', if_not_auth_next, sign_in)


// Log out

router.get('/log_out', if_auth_next, log_out)




module.exports = router