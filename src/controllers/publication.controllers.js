const PublicationModel = require('../models/Publication')
const UserModel = require('../models/User')
const is_the_author = require('../helpers/is_the_author.helpers')
// ---- --- eliminar get_url --- ---
const get_url = require('../helpers/get_url.helpers')
const is_empty = require('../helpers/is_empty.helpers')
const {delete_img} = require('../helpers/img.helpers')
const validate_genres = require('../helpers/validate_genres.helpers')
const User = require('../models/User')
const { json } = require('express')
const Publication = require('../models/Publication')

const postCtrl = {}




// New

postCtrl.new_publication = (req, res) => {
	let content = '<h1>\nHola :D, coloca tu título aquí\n</h1>'
	content += '\n\n<p>\nY con esta esta etiqueta puedes agregar párrafos\n</p>'
	content += '\n\n<p>\nMás párrafos\n</p>'

	const publication = {content, new:true}
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
		authors: [{
			_id: req.user._id,
			name: req.user.name,
			job: req.user.job,
			profile_img: req.user.profile_img
		}],
		suggestions: false
	})
}




// Save and Update
// separar save de update
postCtrl.save_update_publication = async (req, res) => {
	const publication = req.body

	// validate post content
	const err = await validate_post_content(publication)
	if (!is_empty(err)) return res.json(err)

	const genders = publication.genders
	delete publication.genders
	const url = publication.url
	delete publication.url

	let publication_db
	if (url == 'new') {
		publication.authors = [req.user.id]
		publication_db = await PublicationModel.create(publication)
		req.user.hearts.push(publication_db.id)
		req.user.updateOne({hearts: req.user.hearts}).exec()
	} else {
 		publication_db = await PublicationModel.findById(url)
		const is_author = is_the_author(req.user._id, publication_db)
		if (!is_author) return res.json({})
		await publication_db.updateOne(publication)
	}

	await updateUserWorkGenres(
		req.user,
		genders,
		publication_db.id
	)

	res.json({id: publication_db.id})
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
	const error = {}

	/*
	if (publication.url != get_url(publication.title))
		return {url: 'Don\'t cheat me'}
		
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
	*/

	if (!validate_genres(publication.genders))
		error.genders = 'Portate bien  ; b'

	return error
}




// Delete

postCtrl.delete_publication = async (req, res) => {
	const url = req.body.url_article
	let publication
	try {
		publication = await PublicationModel
			.findById(url)
			.select('authors')
	} catch {return res.redirect('/')}

	const user = req.user
	const is_author = is_the_author(user._id, publication)
	if (!is_author) return res.redirect('/')

	await delete_img(publication.img_miniature)
	const was_deleted = await PublicationModel
		.deleteOne({_id: url})

	removeGenres(publication)

	res.send(was_deleted.n ? 'ok' : 'fail')
}

function removeGenres(post) {
	function thenRemoveGenres(author) {
		const genresWorks = author.genresWorks
		Object.keys(genresWorks).forEach(gender => {
			if (genresWorks[gender][post._id] !== null) return
			delete genresWorks[gender][post._id]

			const gender_empty = !Object.keys(genresWorks[gender]).length
			if (gender_empty) delete genresWorks[gender]
		})
		author.updateOne({genresWorks}).exec()
	}

	for (let id_author of post.authors)
		UserModel.findById(id_author)
			.select('genresWorks')
			.then(thenRemoveGenres)
}




// Get

postCtrl.get_publication = async (req, res) => {
	const url = req.params.url_publication

	/*
	const publication = await PublicationModel
		.findOneAndUpdate(
			{url: url_publication},
			{views: 1}, //'{"$sum": 1}'
			{new: true}
		).select('authors _id public content title description img_miniature views')
	https://docs.mongodb.com/manual/reference/operator/aggregation/sum/
	*/

	let publication
	try {
		publication = await PublicationModel
			.findById(url)
			.select(`
				authors
				title
				description
				public
				content
				img_miniature
				hearts
			`)
		if (!publication) return res.redirect('/')
	} catch {
		return res.redirect('/')
	}

	const suggestions = await getSuggestions(publication.authors, publication.id)
	// console.log('\n\n\n', suggestions, suggestions.length)

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
			authors,
			suggestions
		})
	}
	res.redirect('/')
}

function getSuggestions(authors, id_current_post) {
	return new Promise(async res => {
		// get posts from one of the authors of this post

		const author_id = authors[rand(authors.length)]

		const suggestions = {author: false, from_others: false}
		let random_posts = []

		// select up to three posts by this author
		const threePostsAuthor = async author_posts => {
			// select the ids of the posts of this author
			author_posts = author_posts.genresWorks
			let id_posts = []
			Object.keys(author_posts).forEach(gender => {
				id_posts = id_posts.concat(
					Object.keys(author_posts[gender])
				)
			})

			// select up to three random post ids by this author
			const random_ids = []
			const len = id_posts.length
			for (let i = 0; i < 4; i++) {
				let random_id = id_posts[rand(len)]
				if (random_id != id_current_post)
					random_ids.push(random_id)
			}

			// getting the posts
			const posts = await PublicationModel
				.find({public: true, _id: {$in: random_ids}})
				.select('title description')
			random_posts = posts.concat(random_posts)
			if (suggestions.from_others) res(random_posts)
			suggestions.author = true
		}

		UserModel.findById(author_id)
			.select('genresWorks')
			.then(threePostsAuthor)


		// get suggestions from writers who are not authors of this post

		const posts = await PublicationModel.aggregate([
			{$sample: {size: 20}},
			{$match: {
				public: true,
				authors: {$ne: author_id}
			}}
		]).project('title description')

		random_posts = random_posts.concat(posts)
		if (suggestions.author) res(random_posts)
		suggestions.from_others = true
	})
}

function rand(max = 1) {
	return Math.floor(Math.random() * max)
}

function getAuthors(authors, fields='name profile_img job') {
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
				.select(fields)
				.then(resolve)
	})
}




// hearts

postCtrl.hearts = async (req, res) => {
	const user = req.user
	const id_post = req.params.url_publication

	let post
	try {
		post = await PublicationModel
			.findById(id_post)
			.select('hearts')
	} catch {
		return res.send('Tracing your ip address attempt 1 of 2')
	}

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