const router = require('express').Router()
const {
	index,
	render_log_in,
	log_in,
	log_out,
	new_publication,
	upload_img,
	get_publication,
	save_update_publication,
	delete_publication
} = require('../controllers/controllers')

router.get('/', index)

router.get('/iniciar_sesion', render_log_in)
router.post('/iniciar_sesion', log_in)
router.get('/log_out', log_out)

router.post('/upload_img', upload_img)

router.get('/new', new_publication)
router.post('/new', new_publication)
router.get('/:url_publication', get_publication)
router.post('/save_update_publication', save_update_publication)

router.delete('/delete_publication', delete_publication)

module.exports = router