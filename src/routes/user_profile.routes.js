const router = require('express').Router()
const {user_profile} = require('../controllers/user_profile.controllers')
const PublicationModel = require('../models/Publication')




// Index
router.get('/', async (req, res) => {
	const publications = await PublicationModel
		.find({public: true})
		.limit(3)
		.select('title url description img_miniature')

	res.render('index', {publications})
})

// Profile
router.get('/p/:req_profile', user_profile)




module.exports = router