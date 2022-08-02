const PublicationModel = require('../models/Publication')
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
		my_profile: req.user.name,
		log_in: 'log_out'
	}
	res.render('publication', {
		Nav,
		is_author: true,
		publication,
		user: req.user
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
		const is_author = is_the_author(req.user.name, publication_db)
		if (!is_author)
			return res.json({})
		await publication_db.updateOne(publication)
	} else {
		publication.authors = [req.user.name]
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

	const is_author = is_the_author(req.user.name, publication)
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
	const publication = await PublicationModel.findOne({
		url: url_publication
	})

	if (!publication)
		return res.redirect('/')

	let user_name = ''
	const auth = req.isAuthenticated()
	if (auth)
		user_name = req.user.name

	const is_author = is_the_author(user_name, publication)
	if (publication.public || is_author) {
		const Nav = {
			new: auth ? 'new' : 'log_in',
			home: true,
			my_profile: auth ? req.user.name : false,
			log_in: auth ? 'log_out' : 'log_in'
		}
		return res.render('publication', {
			Nav,
			is_author,
			publication,
			user: req.user
		})
	}
	res.redirect('/')
}




module.exports = postCtrl