const Model = {}
const {Schema, model} = require('mongoose')
const delete_img = require('../helpers/helpers').delete_img

const Publication = new Schema({
	type: {type: String, required: true},
	public: {type: Boolean, required: true},
	url: {type: String, unique: true, required: true},
	img_miniature: {type: String},
	title: {type: String},
	description: {type: String},
	content: {type: String},
}, {timestamps: true})

Model.PublicationModel = model('Publication', Publication)




async function delete_publication(url) {
	const publication = await Model.PublicationModel.findOne({url})
	if (!publication)
		return 'Publication does not exist'

	await delete_img(publication.img_miniature)
	const was_deleted = await Model.PublicationModel.deleteOne({url})
	if (was_deleted.n)
		return 'ok'
	return 'db err'
}

Model.delete_publication = delete_publication




module.exports = Model