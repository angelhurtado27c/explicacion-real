const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const UserModel = require('../models/User')

passport.use(new LocalStrategy({
	usernameField: 'name',
	passwordField: 'pass'
}, async (name, pass, done) => {
	const user = await UserModel.findOne({name})
	if (user) {
		const matchPass = await user.matchPass(pass)
		if (matchPass)
			return done(null, user) // Guarda al usuario en la sesion del servidor
		else
			return done(null, false, {message: 'Revisa la contraseña'})
	} else
		return done(null, false, {message: 'Revisa el usuario'})
}))

passport.serializeUser((user, done) => {
	done(null, user.name)
})

passport.deserializeUser((name, done) => {
	UserModel.findOne({name}, (err, user) => {
		done(err, user)
	})
})