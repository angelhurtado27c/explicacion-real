const router = require('express').Router()
const PublicationModel = require('../models/Publication')




// Index
async function getPosts(size = 12) {
	// db.mycoll.aggregate( { $sample: { size: 1 } } )
	return await PublicationModel.aggregate([
		{$sample: {size}},
		{$match: {public: true}}
	]).project('title description')
}

router.get('/', async (req, res) => {
	const auth = req.isAuthenticated()
	const Nav = {
		new: auth ? 'new' : 'log_in',
		home: false,
		my_profile: auth ? req.user._id : false,
		log_in: auth ? 'log_out' : 'log_in'
	}
	const posts = await getPosts()
	res.render('index', {Nav, posts})
})




router.post('/posts', async (req, res) => {
	const ids = req.body
	console.log('ids', ids.length)
	console.log((await getPosts()).length)
	console.log()
	res.json({ok: true})
})




module.exports = router