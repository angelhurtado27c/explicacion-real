const {Schema, model} = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
	name: {type: String, required: true, unique: true},
	pass: {type: String, required: true},
	profile_img: {type: String},
	job: {type: Array},
	social_networks: {type: Array}
}, {timestamps: true})

UserSchema.methods.encryptPass = async pass => {
	const salt = await bcrypt.genSalt(10)
	return await bcrypt.hash(pass, salt)
}

UserSchema.methods.matchPass = async function(pass) {
	return await bcrypt.compare(pass, this.pass)
}

module.exports = model('User', UserSchema)