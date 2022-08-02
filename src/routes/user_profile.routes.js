const router = require('express').Router()
const {user_profile} = require('../controllers/user_profile.controllers')
const {if_auth_next} = require('../helpers/auth.helpers')
const UserModel = require('../models/User')




// Profile
router.get('/u/:user_id', user_profile)

router.put('/user_data', if_auth_next, async (req, res) => {
	// !user[req.body.field]
	if (req.body.field != 'job' && req.body.field != 'name')
		return res.json({}) // err

	/*
	const user = await UserModel
		.findOne({name: req.user.name})
		.select(req.body.field)
	*/

	req.user[req.body.field] = req.body.value
	try {
		await req.user.save()
		res.json({})
		console.log('ok')
	} catch(e) {
		res.json({err: 'db'})
		console.log('un salto de fé')
	}
})

router.put('/social_networks', if_auth_next, async (req, res) => {
	const social_networks = req.body

	if (typeof(social_networks.length) == 'undefined')
		return res.json({})

	for (let net of social_networks) {
		if (typeof(net.length) == 'undefined')
			return res.json({})

		if (!net[0]) return res.json({})

		try {new URL(net[1])}
		catch(e) {return res.json({})}
	}

	const user = await UserModel
		.findOne({name: req.user.name})
		.select('social_networks')

	if (social_networks.length)
		user.social_networks = social_networks
	else
		user.social_networks = undefined

	try {
		await user.save()
		res.json({})
	} catch(e) {
		res.json({err: 'db'})
	}
})




module.exports = router