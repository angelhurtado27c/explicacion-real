const PublicationModel = require('../models/Publication')
const UserModel = require('../models/User')
const is_the_author = require('../helpers/is_the_author.helpers')
const {
	upload_img,
	delete_img
} = require('../helpers/img.helpers')

module.exports = async (req, res) => {
	try {
		const img_name = await upload_img(req, res)
		switch (req.body.destination) {
			case 'img_miniature':
				img_miniature(req, res, img_name)
				break
			case 'img_author':
				img_author(req, res, img_name)
				break
			default:
				await delete_img(img_name)
				res.json({})
		}
	} catch(e) { res.json({err: e}) }
}

async function img_miniature(req, res, img_name) {
	const url = req.body.url
	let publication
	try {
		publication = await PublicationModel.findById(url)
	} catch {
		await delete_img(img_name)
		return res.json({}) // Publicación inexistente
	}

	const is_author = is_the_author(req.user._id, publication)
	if (!is_author) {
		await delete_img(img_name)
		return res.redirect('/')
	}

	const was_img_saved = await save_img_to_db(
		publication, 'img_miniature', img_name
	)
	res.json(was_img_saved)
}

async function img_author(req, res, img_name) {
	const User = await UserModel.findOne({name: req.user.name})
	const was_img_saved = await save_img_to_db(
		User, 'profile_img', img_name
	)
	res.json(was_img_saved)
}

async function save_img_to_db(db, field, img) {
	try {
		const previous_img = db[field]
		db[field] = img
		await db.save()
		await delete_img(previous_img)
		return {img: db[field]}
	} catch(e) {
		await delete_img(img)
		return {err: 'Fallo en la base de datos'}
	}
}