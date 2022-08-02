const multer = require('multer')
const uuid = require('uuid').v4
const extname = require('path').extname
const helpers = {}




const storage = multer.diskStorage({
	destination: `${__dirname}/../public/uploads_img`,
	filename: (req, file, cb) => {
		cb(null,
			// Nombre aleatorio único
			uuid() + extname(file.originalname).toLocaleLowerCase()
		)
		// nombre original
		// cb(null, file.originalname)
	}
})

helpers.multer_upload_img = multer({
	storage, // storage: name
	limits: {fileSize: 1000000}, // 1Mb
	fileFilter: (req, file, cb) => {
		const filetypes = /jpeg|jpg|png|gif/
		const mime_type = filetypes.test(file.mimetype)
		const ext_name = filetypes.test(
			extname(file.originalname).toLowerCase()
		)
		if (mime_type && ext_name)
			return cb(null, true)
		cb('bad format')
	}
	//dest: `${__dirname}/public/uploads_img`}
}).single('img') // el name del form con el que resibirá el arcchivo




helpers.is_empty = map => {
	for (let key in map)
		return false
	return true
}

helpers.get_url = txt => {
	let url = txt

	if (!url)
		return ''

	url = url.toLocaleLowerCase()

	url = url.replace(/[àáâãäå]/g, 'a')
	url = url.replace(/[èéêë]/g, 'e')
	url = url.replace(/[ìíîï]/g, 'i')
	url = url.replace(/ñ/g, 'n')
	url = url.replace(/[òóôõö]/g, 'o')
	url = url.replace(/[ùúûü]/g, 'u')

	url = url.replace(/\W+/g, ' ')
	url = url.replace(/_+/g, ' ')
	url = url.replace(/^\s+/g, '')
	url = url.replace(/\s+$/g, '')
	url = url.replace(/\s+/g, '_')

	return url
}

module.exports = helpers