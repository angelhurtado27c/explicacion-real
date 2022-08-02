const PublicationModel = require('../models/Publication')
const UserModel = require('../models/User')
const is_the_author = require('../helpers/is_the_author.helpers')
const get_url = require('../helpers/get_url.helpers')
const is_empty = require('../helpers/is_empty.helpers')
const {delete_img} = require('../helpers/img.helpers')
const validate_genres = require('../helpers/validate_genres.helpers')

const postCtrl = {}




// New

postCtrl.new_publication = (req, res) => {
	let content = '<h1>\nHola :D, coloca tu título aquí\n</h1>'
	content += '\n\n<p>\nY con esta esta etiqueta puedes agregar párrafos\n</p>'
	content += '\n\n<p>\nMás párrafos\n</p>'

	const publication = {content}
	// *****************
	// ***** type ******
	// *****************
	// publication.type = req.body.type ? req.body.type : 'article'

	const Nav = {
		new: 'new',
		home: true,
		my_profile: req.user._id,
		log_in: 'log_out'
	}
	res.render('publication', {
		Nav,
		is_author: true,
		publication,
		user: req.user,
		authors: []
	})
}




// Save and Update
// separar save de update
postCtrl.save_update_publication = async (req, res) => {
	const publication = req.body

	// validate post content
	const err = await validate_post_content(publication)
	if (!is_empty(err))
		return res.json(err)

	const genders = publication.genders
	delete publication.genders

	let publication_db = await PublicationModel
		.findOne({url: publication.previous_url})

	if (publication_db) {
		const is_author = is_the_author(req.user._id, publication_db)
		if (!is_author)
			return res.json({})
		await publication_db.updateOne(publication)
	} else {
		publication.authors = [req.user.id]
		publication_db = await PublicationModel.create(publication)
	}

	await updateUserWorkGenres(
		req.user,
		genders,
		publication_db.id
	)

	res.json({})
}

async function updateUserWorkGenres(user, genders, id_publication) {
	let obj = {}

	if (user.genresWorks) {
		obj = user.genresWorks

		Object.keys(obj).forEach(gender => {
			if (obj[gender][id_publication] === null) {
				const index = genders.indexOf(gender)
				if (index > -1)
					genders.splice(index, 1)
				else {
					if (Object.keys(obj[gender]).length > 1)
						delete obj[gender][id_publication]
					else
						delete obj[gender]
				}
			}
		})

		genders.forEach(gender => {
			if (!obj[gender])
				obj[gender] = {}
			obj[gender][id_publication] = null
		})
	} else {
		id_publication = String(id_publication)
		genders.forEach(gender => {
			obj[gender] = {}
			obj[gender][id_publication] = null
		})
	}

	await user.updateOne({genresWorks: obj})
}




async function validate_post_content(publication) {
	if (publication.url != get_url(publication.title))
		return {url: 'Don\'t cheat me'}

	const error = {}
	if (!publication.url)
		error.url = 'Debe tener un h1 con contenido'
	else if (publication.url.toLowerCase() == 'new')
		error.url = '!!!Casi rompes la plataforma¡¡¡, ufff menos de la que nos salvamos, mejor cambia el título :b'
	else if (publication.url == 'hola_d_coloca_tu_titulo_aqui')
		error.url = 'Vamos, deja la pereza y cambia el título por defecto :D'
	else if (publication.previous_url != publication.url) {
		// change name
		// podría mejorarse con una session porque el
		// nombre anterior está en la sesion
		if (await PublicationModel.findOne({url: publication.url}))
			error.url = 'El titulo ya está en uso'
	}

	if (!validate_genres(publication.genders))
		error.genders = 'Portate bien  ; b'

	return error
}




// Delete

postCtrl.delete_publication = async (req, res) => {
	const url_publication = req.body.url_article
	const publication = await PublicationModel.findOne({
		url: url_publication
	})

	if (!publication)
		return res.redirect('/')

	const is_author = is_the_author(req.user._id, publication)
	if (!is_author)
		return res.redirect('/')

	await delete_img(publication.img_miniature)
	const was_deleted = await PublicationModel.deleteOne({
		url: url_publication
	})

	res.send(was_deleted.n ? 'ok' : 'fail')
}




// Get

postCtrl.get_publication = async (req, res) => {
	const url_publication = req.params.url_publication

	/*
	const publication = await PublicationModel
		.findOneAndUpdate(
			{url: url_publication},
			{views: 1}, //'{"$sum": 1}'
			{new: true}
		).select('authors _id public content title description img_miniature views')
	https://docs.mongodb.com/manual/reference/operator/aggregation/sum/
	*/
	const publication = await PublicationModel
		.findOne({url: url_publication})
		.select(`
			authors
			_id
			public
			content
			title
			description
			img_miniature
			createdAt
			hearts
		`)

	if (!publication)
		return res.redirect('/')

	/*
	publication
		.updateOne({views: publication.views+1})
		.exec()
	*/

	const authors = await getAuthors(publication.authors)

	let user_id = ''
	const auth = req.isAuthenticated()
	if (auth) user_id = req.user._id

	const is_author = is_the_author(user_id, publication)

	if (publication.public || is_author) {
		const Nav = {
			new: auth ? 'new' : 'log_in',
			home: true,
			my_profile: auth ? req.user._id : false,
			log_in: auth ? 'log_out' : 'log_in'
		}
		//console.log('\n\n\njj Count', await PublicationModel.count())
		return res.render('publication', {
			Nav,
			is_author,
			publication,
			user: req.user,
			authors
		})
	}
	res.redirect('/')
}

function getAuthors(authors) {
	return new Promise(res => {
		const authors_data = []

		const resolve = data => {
			authors_data.push(data[0])
			if (authors_data.length == authors.length)
				res(authors_data)
		}

		for (let author of authors)
			UserModel
				.find({_id: author})
				.select('_id name profile_img job')
				.then(resolve)
	})
}




// hearts

postCtrl.hearts = async (req, res) => {
	const user = req.user
	const id_post = req.params.url_publication

	const post = await PublicationModel
		.findOne({url: id_post})
		.select('hearts')

	if (!post) return res.send('Tracing your ip address attempt 1 of 2')

	if (user.hearts.includes(id_post)) {
		user.hearts.pop(id_post)
		user.updateOne({hearts: user.hearts}).exec()
		post.updateOne({hearts: post.hearts-1}).exec()
		return res.send('0')
	}

	user.hearts.push(id_post)
	user.updateOne({hearts: user.hearts}).exec()
	post.updateOne({hearts: post.hearts+1}).exec()
	res.send('1')
}




module.exports = postCtrl