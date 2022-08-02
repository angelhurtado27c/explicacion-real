const router = require('express').Router()
const {user_profile} = require('../controllers/user_profile.controllers')
const {if_auth_next} = require('../helpers/auth.helpers')
const UserModel = require('../models/User')




// Profile
router.get('/u/:user_id', user_profile)
router.get('/u/:user_id/:img', (req, res, next) => {
	if (['profile', 'background'].includes(req.params.img))
		return next()
	res.redirect(`/u/${req.params.user_id}`)
}, user_profile)


router.put('/user_data', if_auth_next, async (req, res) => {
	const data = validInfo(req.body)
	if (!data) return res.send('invalid name')

	try {
		const user_id = {_id: req.user.id}
		const data_to_update = {}
		data_to_update[data.field] = data.value
		await UserModel.updateOne(user_id, data_to_update)
		return res.send(`ok${data.value}`)
	} catch {
		console.log('err updating user data')
		return res.send('false')
	}
})

function validInfo(info) {
	let field = Object.keys(info)
	if (field.length != 1) return false
	field = field[0]

	let value = info[field]
	value = value.replace(/^\s+/,'')
	value = value.replace(/\s+$/,'')
	value = value.replace(/\s+/g,' ')

	if (field == 'job') return {field, value}
	if (field != 'name') return false

	if (value.length && value) return {field, value}
	return false
}

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