export default class Msg {
	constructor() {
		this.create()
		this.body = document.getElementsByTagName('body')[0]
	}


	create() {
		this.msg = document.createElement('div')
		this.msg.className = 'msg_all_display'

		const style = document.createElement('link')
		style.rel = 'stylesheet'
		style.href = '/css/components/msg.css'
		this.msg.appendChild(style)

		this.div_msg = document.createElement('div')
		this.msg.appendChild(this.div_msg)

		this.description = document.createElement('p')
		this.div_msg.appendChild(this.description)

		this.btn_ok = document.createElement('button')
		this.btn_ok.innerText = 'ok'
		this.btn_ok.onclick = this.remove
		this.div_msg.appendChild(this.btn_ok)
	}


	show = (description = 'Ocurrió un error') => {
		return new Promise(res => {
			this.description.innerHTML = description
			this.body.appendChild(this.msg)
			setTimeout(() => {
				this.msg.style.transition = 'opacity 1s ease'
				this.msg.style.opacity = '1'
				document.addEventListener('keydown', this.keyDownHandle)
				this.keyDownHandleOk = false
				setTimeout(() => {this.keyDownHandleOk = true}, 1020)
			}, 150)
			this.res = res
		})
	}

	remove = () => {
		document.removeEventListener('keydown', this.keyDownHandle)
		this.msg.style.opacity = '0'
		setTimeout(() => {
			this.body.removeChild(this.msg)
			this.res()
		}, 900)
		/*
		 * el tiempo debe ser mas corto que el del desvanecido
		 * para saltarse la parte final del desvaneciso que
		 * casi no se nota
		 */
	}

	keyDownHandle = e => {
		if (!this.keyDownHandleOk)
			return e.preventDefault()

		switch (e.key) {
			case 'Enter':
			case 'Escape':
			case ' ':
				e.preventDefault()
				this.remove()
		}
	}
}