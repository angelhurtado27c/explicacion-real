const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')

// Initialization
const app = express()
require('./config/passport')

// Settings
app.set('PORT', process.env.PORT || 80)
app.set('view engine', 'ejs')
app.set('views', `${__dirname}/views`)
app.use(express.static(`${__dirname}/public`))

// Middlewares
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(session({
	secret: 'secret_string',
	resave: true,
	saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// Global varialbes
app.use((req, res, next) => {
	res.locals.msg_ok = req.flash('msg_ok')
	res.locals.error = req.flash('error')
	next()
})

// Routes
app.use(require('./routes/routes'))

app.listen(app.get('PORT'), () => {
	console.log(`Server on port ${app.get('PORT')}`)
})