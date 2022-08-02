const {Schema, model} = require('mongoose')

const Publication = new Schema({
	type: {type: String, required: true},
	public: {type: Boolean, required: true},
	url: {type: String, unique: true, required: true},
	img_miniature: {type: String},
	title: {type: String},
	description: {type: String},
	content: {type: String},
}, {timestamps: true})

module.exports = model('Publication', Publication)