const PublicationModel = require('../models/Publication')
const is_the_author = require('../helpers/is_the_author.helpers')
const get_url = require('../helpers/get_url.helpers')
const is_empty = require('../helpers/is_empty.helpers')
const {
	upload_img,
	delete_img
} = require('../helpers/img.helpers')

const userCtrl = {}




// New

userCtrl.new_publication = (req, res) => {
	let content = '<h1>\nHola :D, coloca tu título aquí\n</h1>'
	content += '\n\n<p>\nY con esta esta etiqueta puedes agregar párrafos\n</p>'
	content += '\n\n<p>\nMás párrafos\n</p>'

	const publication = {content}
	publication.type = req.body.type ? req.body.type : 'article'

	res.render('publication', {is_author: true, publication})
}




// Save and Update
// separar save de update
userCtrl.save_update_publication = async (req, res) => {
	const publication = req.body

	// validate post content
	const err = await validate_post_content(publication)
	if (!is_empty(err))
		return res.json(err)

	const publication_db = await PublicationModel.findOne({
		url: publication.previous_url
	})

	if (publication_db) {
		const is_author = is_the_author(req.user.name, publication_db)
		if (!is_author)
			return res.json({})
		await publication_db.updateOne(publication)
	} else {
		publication.authors = [req.user.name]
		await PublicationModel.create(publication)
	}

	res.json({})
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

	return error
}




// Upload img miniature
// dar primero credenciales y luego envia la img, modificar front
userCtrl.upload_img_miniature = async (req, res) => {
	try {
		const img_name = await upload_img(req, res)

		const url = req.body.url
		const publication = await PublicationModel.findOne({url})
		if (!publication) {
			await delete_img(img_name)
			return res.json({}) // Publicación inexistente
		}

		const is_author = is_the_author(req.user.name, publication)
		if (!is_author) {
			await delete_img(img_name)
			return res.redirect('/')
		}

		try {
			const previous_img_miniature = publication.img_miniature
			publication.img_miniature = img_name
			await publication.save()
			await delete_img(previous_img_miniature)
		} catch(e) {
			await delete_img(img_name)
			return res.json({err: 'Fallo en la base de datos'})
		}

		res.json({img_miniature: publication.img_miniature})
	} catch(e) {
		res.json({err: e})
	}
}




// Delete

userCtrl.delete_publication = async (req, res) => {
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

userCtrl.get_publication = async (req, res) => {
	const url_publication = req.params.url_publication
	const publication = await PublicationModel.findOne({
		url: url_publication
	})

	if (!publication)
		return res.redirect('/')

	let user_name = ''
	if (req.isAuthenticated())
		user_name = req.user.name

	const is_author = is_the_author(user_name, publication)
	if (publication.public || is_author)
		return res.render('publication', {is_author, publication})
	res.redirect('/')
}




module.exports = userCtrl