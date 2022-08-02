const {Schema, model} = require('mongoose')

const Publication = new Schema({
	authors: {type: Array, require: true},
	//genders: {type: Array, required: true},
	public: {type: Boolean, required: true},
	url: {type: String, unique: true, required: true},
	img_miniature: {type: String},
	title: {type: String},
	description: {type: String},
	content: {type: String},
	views: {type: Number, default: 0},
	hearts: {type: Number, default: 0}
}, {timestamps: true})

module.exports = model('Publication', Publication)