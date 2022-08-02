const PublicationModel = require('../models/Publication')
const is_empty = require('../helpers/is_empty.helpers')

const userCtrl = {}




userCtrl.user_profile = async (req, res) => {
	const req_profile = req.params.req_profile
	const auth = req.isAuthenticated()
	let publications
	let is_author = false
	if (auth && req.user.name == req_profile) {
		publications = await PublicationModel.find({
			authors: req_profile
		})
		is_author = true
	} else {
		publications = await PublicationModel.find({
			authors: req_profile,
			public: true
		})
	}

	if (is_empty(publications))
		return res.redirect('/log_in')
	res.render('user_profile', {is_author, publications})




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