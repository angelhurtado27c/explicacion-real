const PublicationModel = require('../models/Publication')
const UserModel = require('../models/User')
const router = require('express').Router()
const ignoreAccents = require('../helpers/ignoreAccents.helpers')




function search(query, posts_fields, users_fields) {return new Promise(res => {
	query = query.replace(/^\s+/,'')
	query = query.replace(/\s+$/,'')
	query = query.replace(/\\/g,'\\\\')
	query = query.replace(/\|/g,'\\\|')

	query = query.split(/\s+/)
	let first_word = query[0]
	query = query.join('|')
	// query = query.replace(/\s+/g,'|')

	query = escSpecialChars(query)
	query = ignoreAccents(query)
	try {
		query = new RegExp(`(${query})`, 'gi')
		first_word = new RegExp(`^${first_word}`, 'i')
	} catch { console.log(`Error al completar "${query}`) }

	const results = {posts: [], users: []}
	let end_publications = false
	let end_users = false

	PublicationModel
		.find({$and: [
			{title: first_word},
			{public: true, title: query}
		]})
		// .find({public: true, title: query})
		.limit(6)
		.select(posts_fields)
		.then(posts => {
			const fields = posts_fields.split(' ')
			for (let post of posts) {
				let p = {}
				for (let field of fields)
					p[field] = post[field]
				results.posts.push(p)
			}

			if (end_users)
				res(results)
			end_publications = true
		})

	UserModel
		.find({$and: [
			{name: query},
			{name: first_word}
		]})
		.limit(6)
		.select(users_fields)
		.then(users => {
			const fields = users_fields.split(' ')
			for (let user of users) {
				let u = {}
				for (let field of fields)
					u[field] = user[field]
				results.users.push(u)
			}

			if (end_publications)
				res(results)
			end_users = true
		})
})}

function escSpecialChars(txt) {
	// const chars = '()[]{}.^$+*?'
	const chars = '()[]{}.^$+*?,=!<:'
	for (let char of chars) {
		let r_e = new RegExp(`\\${char}`, 'g')
		txt = txt.replace(r_e, `\\${char}`)
	}
	return txt
	/*
		https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Regular_Expressions
		\, ., \cX, \d, \D, \f, \n, \r, \s, \S, \t, \v, \w, \W, \0, \xhh, \uhhhh, \uhhhhh, [\b]	
		^, $, x(?=y), x(?!y), (?<=y)x, (?<!y)x, \b, \B	
		(x), (?:x), (?<Name>x), x|y, [xyz], [^xyz], \Number	
		*, +, ?, x{n}, x{n,}, x{n,m}	
		\p{UnicodeProperty}, \P{UnicodeProperty}
*/
}




router.get('/complete', async (req, res) => {
	const query = req.query.q
	const posts_fields = 'title'
	const users_fields = 'name job'
	const matches = await search(query, posts_fields, users_fields)

	const posts = []
	for (let post of matches.posts)
		posts.push(post.title)
	matches.posts = posts

	const users = []
	for (let user of matches.users)
		users.push(`${user.name} - ${user.job ? user.job : 'Usuario'}`)
	matches.users = users

	res.json(matches)
})

router.get('/search', async (req, res) => {
	const query = req.query.q
	const posts_fields = 'title _id description img_miniature'
	const users_fields = 'profile_img name job _id'
	const matches = await search(query, posts_fields, users_fields)

	const auth = req.isAuthenticated()
	const Nav = {
		new: auth ? 'new' : 'log_in',
		home: true,
		my_profile: auth ? req.user._id : false,
		log_in: auth ? 'log_out' : 'log_in',
		search_value: query
	}

	res.render('index', {Nav, posts: matches})
})

module.exports = router