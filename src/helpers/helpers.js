const multer = require('multer')
const MulterError = require('multer').MulterError
const unlink = require('fs').unlink
const uuid = require('uuid').v4
const extname = require('path').extname
const helpers = {}




helpers.upload_img = (req, res) => {
	return new Promise((resolve, reject) => {
		multer_upload_img(req, res, err => {
			let error_upload = ''

			if (err instanceof MulterError) {
				// A Multer error occurred when uploading.
				if (err.code == 'LIMIT_FILE_SIZE')
					error_upload = 'Máximo 1MB'
				else
					error_upload = 'unknown'
			} else if (err == 'bad format')
				error_upload = 'Formato no válido'
			else if (err)
				error_upload = 'Ha ocurrido un error desconocido'

			if (error_upload)
				reject(error_upload)
			else
				resolve(req.file.filename)
		})
	})
}

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

multer_upload_img = multer({
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




const dir_imgs = `${__dirname}/../public/uploads_img`

helpers.delete_img = (img_name) => {
	return new Promise(res => {
		if (img_name)
			return unlink(`${dir_imgs}/${img_name}`, err => {res()})
		res()
	})
}




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