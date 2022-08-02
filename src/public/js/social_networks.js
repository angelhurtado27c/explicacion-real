import {is_empty} from './modules/is_empty.js'
import tremble from './modules/tremble.js'
import scrollTo from './modules/scrollTo.js'

class SocialNetworks {
	constructor() {
		$btn_edit.onclick = this.make_form
		const a = $social_networks.querySelectorAll('a')
		if (!a.length)
			this.make_form()
	}

	make_form = e => {
		this.social_networks = document.createElement('form')
		this.inputs = document.createElement('div')
		this.social_networks.appendChild(this.inputs)
		const nets = document.querySelectorAll('.social_networks a')
		this.i_net = 0
		for (let net of nets) {
			let net_input = this.make_input(net)
			this.inputs.appendChild(net_input)
		}

		this.add_empty_input()

		this.err = document.createElement('div')
		this.err.className = 'err'
		this.social_networks.appendChild(this.err)

		const submit = document.createElement('input')
		submit.type = 'submit'
		submit.value = 'ok'
		submit.onclick = this.update_social_networks
		this.social_networks.appendChild(submit)

		const btn_cancel = document.createElement('button')
		btn_cancel.innerHTML = 'Cancelar'
		btn_cancel.onclick = this.cancel
		this.social_networks.appendChild(btn_cancel)

		for (let c of $social_networks.children)
			c.style.display = 'none'

		$social_networks.appendChild(this.social_networks)
		
		if (e) {
			scroll({
				top: document.body.offsetHeight,
				behavior: "smooth"
			})
		}
	}

	make_input(net) {
		this.i_net++
		const net_name = document.createElement('input')
		net_name.type = 'text'
		net_name.name = `name${this.i_net}`
		net_name.placeholder = 'Red social'
		net_name.value = net.innerHTML
		net_name.oninput = this.in_writing

		const net_url = document.createElement('input')
		net_url.type = 'url'
		net_url.name = `url${this.i_net}`
		net_url.placeholder = 'Url de tu perfil'
		net_url.value = net.href
		net_url.oninput = this.in_writing

		const input_net = document.createElement('div')
		input_net.appendChild(net_name)
		input_net.appendChild(net_url)
		return input_net
	}

	add_empty_input() {
		const net_input = this.make_input({
			innerHTML: '',
			href: '',
		})
		net_input.last = true
		this.inputs.appendChild(net_input)
	}

	in_writing = e => {
		const element = e.target
		const parent = element.parentNode
		const last = parent.last

		if (element.value) {
			if (last) {
				parent.last = false
				this.add_empty_input()
			}
		} else {
			for (let c of parent.childNodes)
				if (c.value) return
			parent.parentNode.removeChild(parent)
		}
	}

	form_to_array(form) {
		const data = []
		let net_name_empty = 0
		let net_url_empty = 0
		let net_name
		let net_url
		let change = 'net_name'
		for (let field of form) {
			switch(change) {
				case 'net_name':
					net_name = field[1]
					net_name_empty += !net_name ? 1 : 0
					if (net_name_empty > 1)
						throw 'pásame el nombre de la red social'
					change = 'net_url'
					break
				case 'net_url':
					net_url = field[1]
					if (net_url) {
						try {new URL(net_url)}
						catch(e) {throw 'jmm, revisa la url'}
					} else
						net_url_empty++
					if (net_url_empty > 1)
						throw 'Necesito la url de tu perfil'
					change = 'net_name'
					data.push([net_name, net_url])
			}
		}

		const last_data = data[data.length-1]
		if (last_data[0] || last_data[1])
			throw ''

		data.pop()
		return data
	}

	cancel = e => {
		e.preventDefault()
		const parent_form = this.social_networks.parentElement
		parent_form.removeChild(this.social_networks)

		for (let c of parent_form.children)
			c.style.display = 'block'
	}

	update_social_networks = async e => {
		e.preventDefault()
		this.t_tremble
		const form = e.target.parentNode
		let data
		try {
			data = this.form_to_array(new FormData(form))
		} catch(e) {
			this.err.innerHTML = `<p>${e}</p>`
			scrollTo(this.err)
			tremble(this.err)
			return
		}

		const res = await fetch('/social_networks', {
			method: 'PUT',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(data)
		})
		const err = await res.json()
		if (!is_empty(err))
			return alert('error')

		form.parentNode.removeChild(form)
		$btn_edit.style.display = 'block'
		this.make_a(data)
	}

	make_a = data => {
		const a = $social_networks.querySelectorAll('a')
		a.forEach(i_a => {$social_networks.removeChild(i_a)})

		for (let net of data) {
			const a = document.createElement('a')
			a.innerHTML = net[0]
			a.href = net[1]
			a.target = '_blank'
			$social_networks.appendChild(a)
			$social_networks.insertBefore(a, $btn_edit)
		}
	}
}

const socialNetworks = new SocialNetworks