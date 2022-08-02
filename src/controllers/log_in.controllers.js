const passport = require('passport')
const UserModel = require('../models/User')
const is_empty = require('../helpers/is_empty.helpers')

const logInCtrl = {}




// Log in

logInCtrl.render_log_in = (req, res) => {
	res.render('log_in')
}

logInCtrl.log_in = passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/log_in',
	failureFlash: true
})




// Sign in

logInCtrl.render_sign_in = (req, res) => {
	res.render('sign_in', {user_name: '', err: ''})
}

logInCtrl.sign_in = async (req, res) => {
	const {user_name, pass, confirm_pass} = req.body

	const err = {}
	if (await UserModel.findOne({name: user_name}))
		err.name = 'Nombre de usuario no disponible'
	if (pass != confirm_pass)
		err.pass_match = 'Las contraseñas no coinciden'
	if (pass.length < 8)
		err.pass_length = 'La contraseña debe tener almeneos 8 caracteres'

	if (!is_empty(err))
		return res.render('sign_in', {user_name, err})

	const user = new UserModel({name: user_name, pass})
	user.pass = await user.encryptPass(pass)
	await user.save()

	// optimizar cn ? :
	req.login({name: user_name}, err => {
		if (!err)
			return res.redirect('/')
		res.redirect('/sign_in')
	})
}




// Log out

logInCtrl.log_out = (req, res) => {
	const same_site = req.headers.referer
	req.logout()
	res.redirect(same_site)
}




module.exports = logInCtrl