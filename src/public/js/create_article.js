import {render_math} from './modules/render_math.js'
import {} from './modules/delete_publication.js'
import scrollTo from './modules/scrollTo.js'
import tremble from './modules/tremble.js'

$save.onclick = save

async function save() {
	this.onclick = null
	this.innerHTML = 'Guardando...'

	await upload_data()
	const publication_exists = window.location.pathname.substr(1) != 'new'
	if (publication_exists) {
		await upload_img_miniature()
		$new.active = true
		if ($btn_return.style.display == '')
			$new.style.display = 'block'
	}

	$save.innerHTML = 'Guardar'
	this.onclick = save
}

function upload_img_miniature() {
	return new Promise(async res => {
		if (!$upload_img.files[0])
			return res({err: 'not select img'})

		const img = new FormData()
		img.append('destination', 'img_miniature')
		img.append("url", window.location.pathname.substr(1))
		img.append("img", $upload_img.files[0])

		const img_res = await fetch('/upload_img', {
			method: 'POST',
			headers: {'enctype': 'multipart/form-data'},
			body: img
		})

		const img_was_uploaded = await img_res.json()
		const img_url = img_was_uploaded.img
		const err = img_was_uploaded.err

		if (img_url) {
			$miniature_img.src = `/uploads_img/${img_url}`
			$img_err.innerHTML = ''
			$upload_img.value = ''
		} else if (err && err != 'not select img')
			$img_err.innerHTML = img_was_uploaded.err

		res(img_was_uploaded)
	})
}

function upload_data() { return new Promise(async res => {
	let url = window.location.pathname.substr(1)

	const genders = getGendersSelected()
	if (!genders.length) {
		showErr({'gender': 'Indicame al menos un género 😉'})
		scrollTo($gender_search)
		return res(false)
	}

	const data_res = await fetch('/save_update_publication', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			public: $public.checked,
			url,
			title: val_first_element('h1'),
			description: val_first_element('p'),
			content: $textarea.value,
			genders: getGendersSelected()
		})
	})

	const err = await data_res.json()
	url = err.id
	delete err.id

	if (!is_empty(err)) {
		showErr(err)
		return res(false)
	}

	$err.style.display = 'none'
	$publication.innerHTML = $textarea.value
	render_math()
	if (url != 'new' && url != window.location.pathname.substr(1))
		history.pushState(null, '', url)
	document.getElementsByClassName('delete')[0].style.display = ''

	res(true)
}) }

function getGendersSelected() {
	const gender_list_element = $gender_list
		.querySelectorAll('input:checked + span + span')

	const selected_genres = []
	for (let gender of gender_list_element)
		selected_genres.push(gender.innerText)

	return selected_genres
}

function showErr(errors) {
	$list_err.innerHTML = ''
	for (let err in errors) {
		const li_err = document.createElement('li')
		li_err.innerHTML = errors[err]
		$list_err.appendChild(li_err)
	}
	tremble($err)
	$err.style.display = 'block'
}




function val_first_element(element_name) {
	const val_textarea = document.createElement('div')
	val_textarea.innerHTML = $textarea.value
	let val = val_textarea.getElementsByTagName(element_name)

	if (!val.length)
		return ''

	val = val[0].innerHTML
	val = val.replace(/^\s+/g, '')
	val = val.replace(/\s+$/g, '')
	return val
}

function is_empty(map) {
	for (let key in map)
		return false
	return true
}