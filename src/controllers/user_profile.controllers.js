const PostModel = require('../models/Publication')
const UserModel = require('../models/User')

const userCtrl = {}




userCtrl.user_profile = async (req, res) => {
	const req_profile = req.params.req_profile
	const user = await UserModel
		.findOne({name: req_profile})
		.select('profile_img name job social_networks')
	if (!user)
		return res.redirect('/')

	const auth = req.isAuthenticated()
	const my_user_name = auth ? req.user.name : null

	const match = {authors: req_profile}
	user.is_author = false
	if (auth && my_user_name == req_profile)
		user.is_author = true
	else
		match.public = true

	const posts = await PostModel.aggregate([
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
	const posts = await PostModel
		.find(match)
		.select('url type img_miniature title description')
	*/

	const Nav = {
		new: auth ? 'new' : 'log_in',
		home: true,
		my_profile: auth ? (user.is_author ? false : req.user.name) : false,
		log_in: auth ? 'log_out' : 'log_in'
	}
	if (!user.job && user.is_author)
		user.job = '¿Qué temas trata tu obra (tus trabajos)?'
	res.render('user_profile', {Nav, user, posts})




	/*
	PostModel.create({
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