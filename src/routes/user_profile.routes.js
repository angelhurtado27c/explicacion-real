const router = require('express').Router()
const {user_profile} = require('../controllers/user_profile.controllers')
const PublicationModel = require('../models/Publication')




// Index
router.get('/', async (req, res) => {
	const posts = await PublicationModel
		.find({public: true})
		.limit(6)
		.select('title url description img_miniature')

	const auth = req.isAuthenticated()

	const Nav = {
		new: auth ? 'new' : 'log_in',
		home: false,
		my_profile: auth ? req.user.name : false,
		log_in: auth ? 'log_out' : 'log_in'
	}
	res.render('index', {Nav, posts})
})

// Profile
router.get('/p/:req_profile', user_profile)




module.exports = router