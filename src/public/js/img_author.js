import {is_empty} from './modules/is_empty.js'
import Msg from './modules/Msg.js'
const msg = (new Msg()).show
// import msg_ok_cancel from './modules/Msg_Ok_Cancel.js'

$file_img_profile.onchange = async function() {
	if (!this.files[0]) return

	const img = new FormData()
	img.append('destination', 'img_author')
	img.append('img', this.files[0])

	const img_res = await fetch('/upload_img', {
		method: 'POST',
		headers: {'enctype': 'multipart/form-data'},
		body: img
	})
	this.value = ''

	const img_was_uploaded = await img_res.json()
	if (img_was_uploaded.img) {
		const url_img = `/uploads_img/${img_was_uploaded.img}`
		$imgProfile.src = url_img
	} else await msg('Oye, pásame una img en formato jpg png gif webp y hasta de 1MB')
}

$file_img_background.onchange = async function(e) {
	if (!this.files[0]) return

	const img = new FormData()
	img.append('destination', 'img_author_cover')
	img.append('img', this.files[0])

	const img_res = await fetch('/upload_img', {
		method: 'POST',
		headers: {'enctype': 'multipart/form-data'},
		body: img
	})

	const img_was_uploaded = await img_res.json()
	if (img_was_uploaded.img) {
		const url_img = `/uploads_img/${img_was_uploaded.img}`
		$presentation_background.src = url_img
	} else await msg('Oye, pásame una img en formato jpg png gif webp y hasta de 1MB')
}




class EditProfile {
	constructor(data, input, btn_edit_cancel, btn_ok) {
		this.data = data
		this.form = input.parentNode
		this.input = input
		this.btn_edit_cancel = btn_edit_cancel
		this.btn_ok = btn_ok
		this.btn_edit_cancel.addEventListener('click', this.edit)
	}

	edit = e => {
		e.preventDefault()
		// configuring events
		this.btn_edit_cancel.removeEventListener('click', this.edit)
		this.btn_edit_cancel.addEventListener('click', this.cancel)
		this.btn_ok.addEventListener('click', this.updateData)
		// show form
		this.data.style.display = 'none'
		if (this.data.innerText == 'Profesión')
			this.input.value = ''
		else
			this.input.value = this.data.innerText
		this.form.className = ''
		this.btn_edit_cancel.className = ''
		this.btn_ok.style.display = 'initial'
		this.btn_ok.parentNode.classList.remove('minimum')
		this.btn_ok.parentNode.style.display = 'flex'
		const tag = this.input
		tag.style.display = 'initial'
		tag.focus()
		tag.selectionStart = tag.selectionEnd = tag.value.length
		const span = this.btn_edit_cancel.children[0]
		span.className = ''
		span.innerText = 'Cancelar'

		// hide the other form
		this.on_edit_hide.hideForm()
	}

	cancel = e => {
		e.preventDefault()
		this.hideForm()
	}

	updateData = async e => {
		e.preventDefault()

		if (this.input.value == this.data.innerText)
			return this.hideForm()

		const field = this.input.id.substr(7)
		let body = {}
		body[field] = this.input.value
		body = JSON.stringify(body)

		let res = await fetch('/user_data', {
			method: 'PUT',
			headers: {'Content-Type': 'application/json'},
			body
		})
		res = await res.text()

		if (res.substr(0,2) == 'ok')
			this.data.innerText = res.substr(2) ? res.substr(2) : 'Profesión'
		else if (res == 'invalid name')
			console.log('invalid name')
		else
			console.log('La base de datos se quedó dormida, por favor, intentalo mas tarde que ya debe haber despertado, la base de datos te lo agradece')

		this.hideForm()
	}

	hideForm() {
		// configuring events
		this.btn_edit_cancel.removeEventListener('click', this.cancel)
		this.btn_edit_cancel.addEventListener('click', this.edit)
		this.btn_ok.removeEventListener('click', this.updateData)
		// hide form
		this.data.style.display = 'inline'
		this.form.className = 'minimum'
		this.btn_edit_cancel.className = 'minimum'
		this.btn_ok.style.display = 'none'
		this.btn_ok.parentNode.classList.add('minimum')
		this.btn_ok.parentNode.style.display = 'none'
		this.input.style.display = 'none'
		const span = this.btn_edit_cancel.children[0]
		span.className = 'i_edit'
		span.innerText = ''
	}
}


const Edit_Name = new EditProfile(
	$name,
	$input_name,
	$btn_name_edit_cancel,
	$btn_name_ok
)

const Edit_Job = new EditProfile(
	$job,
	$input_job,
	$btn_job_edit_cancel,
	$btn_job_ok
)

Edit_Name.on_edit_hide = Edit_Job
Edit_Job.on_edit_hide = Edit_Name