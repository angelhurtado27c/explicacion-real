import {is_empty} from './modules/is_empty.js'

$file_img_profile.onchange = async function(e) {
	$img_err.style.display = 'none'

	if (!this.files[0])
		return

	const img = new FormData()
	img.append('destination', 'img_author')
	img.append('img', this.files[0])

	const img_res = await fetch('/upload_img', {
		method: 'POST',
		headers: {'enctype': 'multipart/form-data'},
		body: img
	})

	const img_was_uploaded = await img_res.json()
	if (img_was_uploaded.img) {
		const url_img = `/uploads_img/${img_was_uploaded.img}`
		$imgProfile.src = url_img
	} else {
		$img_err.innerHTML = img_was_uploaded.err
		$img_err.style.display = 'block'
	}
}




class EditProfile {
	constructor() {
		this.makeForm()
		this.element = null
		document.addEventListener('dblclick', this.editEvent)
		document.addEventListener('click', this.disableEditing)
	}




	/* --- --- --- enable editing --- --- ---- */



	editEvent = e => {
		const is_editable = this.do_have_class(e.target, 'editable')
		if (is_editable) {
			if (this.element)
				this.element.style.display = 'block'
			this.element = e.target
			this.editWithInputText()
		} else if (this.element)
			this.hideInput()
	}

	editWithInputText = () => {
		this.input.value = this.element.innerHTML
		const container = this.element.parentNode
		container.insertBefore(this.form, this.element)
		this.showInput()
	}

	/* --- --- --- disaable editing --- --- ---- */

	disableEditing = e => {
		const ignore = this.do_have_class(e.target, 'ignore')
		!this.element || ignore ? null : this.hideInput()
	}

	showInput = () => {
		this.element.style.display = 'none'
		this.form.style.display = 'block'
		this.input.focus()
	}

	hideInput = () => {
		this.form.style.display = 'none'
		this.element.style.display = 'block'
	}

	do_have_class(target, class_name) {
		const array_class = target.className.split(' ')
		return array_class.includes(class_name)
	}




	makeForm = () => {
		this.form = document.createElement('form')
		//this.form.className = 'ignore'

		this.input = document.createElement('input')
		this.input.type = 'text'
		this.input.className = 'ignore'
		this.form.appendChild(this.input)

		const submit = document.createElement('input')
		submit.className = 'ignore'
		submit.type = 'submit'
		submit.value = 'ok'
		this.form.appendChild(submit)

		this.form.onsubmit = this.updateProfileData
	}

	/* update the data */

	updateProfileData = async e => {
		e.preventDefault()

		const res = await fetch('/user_data', {
			method: 'PUT',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				field: this.element.id.substr(1),
				value: this.input.value
			})
		})
		const err = await res.json()
		if (is_empty(err))
			this.element.innerHTML = this.input.value
		else
			this.element.innerHTML = err.err
		this.hideInput()
		this.element = null
	}
}




const editProfile = new EditProfile()