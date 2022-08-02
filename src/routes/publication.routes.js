const router = require('express').Router()
const {if_auth_next} = require('../helpers/auth.helpers')
const upload_img_miniature = require('../controllers/img.controllers')
const {
	new_publication,
	get_publication,
	save_update_publication,
	delete_publication
} = require('../controllers/publication.controllers')




// New
router.get('/new', if_auth_next, new_publication)
router.post('/new', if_auth_next, new_publication)

// Save and update
router.post('/save_update_publication', if_auth_next, save_update_publication)

// Upload img miniature
router.post('/upload_img', if_auth_next, upload_img_miniature)

// Delete
router.delete('/delete_publication', if_auth_next, delete_publication)

// Get
router.get('/:url_publication', get_publication)




module.exports = router