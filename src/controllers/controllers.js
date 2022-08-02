const passport = require('passport')
const {
	PublicationModel,
	delete_publication
 } = require('../models/Publication')
const {
	get_url,
	is_empty,
	upload_img,
	delete_img
} = require('../helpers/helpers')

const userCtrl = {}

userCtrl.index = async (req, res) => {
	const auth = req.isAuthenticated()
	let publications
	if (auth)
		publications = await PublicationModel.find()
	else
		publications = await PublicationModel.find({public: true})

	res.render('index', {auth, publications})
}

userCtrl.upload_img_miniature = async (req, res) => {
	try {
		const img_name = await upload_img(req, res)

		const url = req.body.url
		const publication = await PublicationModel.findOne({url})
		if (!publication) {
			await delete_img(img_name)
			return res.json({err: 'Publicación inexistente'})
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
		return res.json({err: e})
	}
}

userCtrl.log_out = (req, res) => {
	const same_site = req.headers.referer
	req.logout()
	res.redirect(same_site)
}




// Log in

userCtrl.render_log_in = (req, res) => {
	if (!req.isAuthenticated())
		return res.render('iniciar_sesion')
	res.redirect('/')
}

userCtrl.log_in = passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/iniciar_sesion',
	failureFlash: true
})




// Publication

userCtrl.new_publication = (req, res) => {
	//const auth = req.isAuthenticated()
	const auth = true

	if (!auth)
		return res.redirect('/')

	let content = '<h1>\nHola :D, coloca tu título aquí\n</h1>'
	content += '\n\n<p>\nY con esta esta etiqueta puedes agregar párrafos\n</p>'
	content += '\n\n<p>\nMás párrafos\n</p>'

	const publication = {content}
	publication.type = req.body.type ? req.body.type : 'article'

	res.render('publication', {auth, publication})
}

userCtrl.get_publication = async (req, res) => {
	const url_publication = req.params.url_publication
	const publication = await PublicationModel.findOne({
		url: url_publication
	})

	//const auth = req.isAuthenticated()
	const auth = true
	if (publication && (auth || publication.public))
		return res.render('publication', {auth, publication})
	res.redirect('/')
}

userCtrl.save_update_publication = async (req, res) => {
	/*
	if (!req.isAuthenticated())
		return res.json({what: 'What do you think you\'re doing ???'})
	*/

	const publication = req.body
	const error = {}

	if (publication.url != get_url(publication.title))
		return res.json({url: 'Don\'t cheat me'})

	if (!publication.url)
		error.url = 'Debe tener un h1 con contenido'
	else if (publication.url.toLowerCase() == 'new')
		error.url = '!!!Casi rompes la plataforma¡¡¡, ufff menos de la que nos salvamos, mejor cambia el título :b'
	else if (publication.url == 'hola_d_coloca_tu_titulo_aqui')
		error.url = 'Vamos, deja la pereza y cambia el título por defecto :D'
	else if (publication.previous_url != publication.url) {
		// change name
		// podría mejorarse con una session
		if (await PublicationModel.findOne({url: publication.url}))
			error.url = 'El titulo ya está en uso'
	}

	if (is_empty(error)) {
		const publication_db = await PublicationModel.findOne({
			url: publication.previous_url
		})

		if (publication_db) {
			try {
				await publication_db.updateOne(publication)
			} catch(e) {
				error.save = 'Base de datos no disponible, intentamás tarde'
			}
		} else {
			try {
				await PublicationModel.create(publication)
			} catch(e) {
				error.save = 'Base de datos no disponible, intentamás tarde'
			}
		}
	}

	if (is_empty(error))
		res.json({})
	else
		res.json(error)
}

userCtrl.delete_publication = async (req, res) => {
	res.send(await delete_publication(req.body.url_article))
}

module.exports = userCtrl