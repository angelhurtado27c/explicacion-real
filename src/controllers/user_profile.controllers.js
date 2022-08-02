const PublicationModel = require('../models/Publication')
const User = require('../models/User')
const is_empty = require('../helpers/is_empty.helpers')

const userCtrl = {}




userCtrl.user_profile = async (req, res) => {
	const req_profile = req.params.req_profile
	const auth = req.isAuthenticated()
	const my_user_name = auth ? req.user.name : null
	let is_author = false
	
	const match = {authors: req_profile}
	if (auth && my_user_name == req_profile)
		is_author = true
	else
		match.public = true

	const posts = await PublicationModel.aggregate([
		{$match: match},
		{$group: {
			_id: '$type',
			posts: {
				$push: {
					authors: '$authors',
					url: '$url',
					img_miniature: '$img_miniature',
					title: '$title',
					description: '$description',
				}
			}
		}}
	])
	/*
	const posts = await PublicationModel
		.find(match)
		.select('url type img_miniature title description')
	*/

	if (is_empty(posts)) {
		const user = await User.findOne({name: req_profile})
		if (!user)
			return res.redirect('/')
	}

	const Nav = {
		new: auth ? 'new' : 'log_in',
		home: true,
		my_profile: auth ? (is_author ? false : req.user.name) : false,
		log_in: auth ? 'log_out' : 'log_in'
	}
	res.render('user_profile', {Nav, is_author, posts})




	/*
	PublicationModel.create({
		authors: ['Ángel', 'David'],
		type: 'recognition',
		public: true,
		url: 'upo',
		title: 'upo',
		description: 'asdf',
		content: '<h1>upo</h1>\n\n<p>asdf</p>'
	})
	*/
}




module.exports = userCtrl