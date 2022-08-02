import {render_math} from './modules/render_math.js'
import {} from './modules/delete_publication.js'

$save.onclick = save

async function save() {
	this.onclick = null
	this.innerHTML = 'Guardando...'

	const data_was_uploaded = await upload_data()
	const publication_exists = window.location.pathname.substr(1) != 'new'
	if (publication_exists) {
		const img_was_uploaded = await upload_img_miniature()
	}

	$save.innerHTML = 'Guardar'
	this.onclick = save
}

function upload_img_miniature() {
	return new Promise(async res => {
		if (!$upload_img.files[0])
			return res('not select image')

		const img = new FormData()
		img.append("url", window.location.pathname.substr(1))
		img.append("img", $upload_img.files[0])

		const img_res = await fetch('/upload_img', {
			method: 'POST',
			headers: {
				'enctype': 'multipart/form-data',
			},
			body: img
		})

		res(await img_res.text())
	})
}

let previous_url = get_url()
function upload_data() {
	return new Promise(async res => {
		const url = get_url()

		const data_res = await fetch('/save_update_publication', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				type: $type.value,
				public: $public.value == '0' ? false : true,
				previous_url,
				url,
				title: val_first_element('h1'),
				description: val_first_element('p'),
				content: $textarea.value
			})
		})

		const err = await data_res.json()

		if (!is_empty(err)) {
			show_err(err)
			return res(false)
		}

		$err.style.display = 'none'
		previous_url = get_url()
		$publication.innerHTML = $textarea.value
		render_math()
		history.pushState(null, '', url)
		document.getElementsByClassName('delete')[0].style.display = ''

		res(true)
	})
}

function show_err(errors) {
	$err.style.display = 'block'
	$list_err.innerHTML = ''
	for (let err in errors) {
		const li_err = document.createElement('li')
		li_err.innerHTML = errors[err]
		$list_err.appendChild(li_err)
	}
}

function get_url() {
	let url = val_first_element('h1')

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