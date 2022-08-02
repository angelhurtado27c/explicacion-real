import fadeEffect from './modules/Fade_Effect.js'

new class View_Img_Author {
	constructor() {
		this.create()
		this.body = document.getElementsByTagName('body')[0]

		document.getElementsByClassName('presentation')[0]
			.addEventListener('click', this.tagRight)

		const img = /\w+$/.exec(document.location.pathname)[0]
		switch(img) {
			case 'profile':
				this.view($imgProfile.src)
				break
			case 'background':
				this.view($presentation_background.src)
		}
	}


	tagRight = e => {
		let img_to_view, url

		switch (e.target.className) {
			case 'presentation':
			case 'user_name':
			case 'user_job':
			case 'img_background':
				img_to_view = $presentation_background
				url = 'background'
				break
			case 'img_author':
				img_to_view = $imgProfile
				url = 'profile'
		}

		if (img_to_view)
			this.view(img_to_view.src, url)
	}


	create() {
		this.background = document.createElement('div')
		this.background.className = 'view_img'
		fadeEffect(this.background)

		this.div_img = document.createElement('div')
		this.background.appendChild(this.div_img)

		this.img_blur = document.createElement('img')
		this.div_img.appendChild(this.img_blur)

		this.img = document.createElement('img')
		this.div_img.appendChild(this.img)

		this.button = document.createElement('button')
		this.button.innerText = 'ok'
		this.background.appendChild(this.button)
	}


	async view(img_src, url = '') {
		if (url)
			history.pushState(null, "", `${document.location.pathname}/${url}`)

		// this.
		window.onpopstate = this.remove

		this.img_blur.src = img_src
		this.img.src = img_src

		this.body.style.overflow = 'hidden'
		this.body.appendChild(this.background)

		this.responsiveImageHeight()
		window.addEventListener('resize', this.responsiveImageHeight)

		await this.background.Fade_Effect.show()
		document.addEventListener('keydown', this.keyDownHandle)
		this.background.addEventListener('click', this.clickHandle)
	}


	remove = async () => {
		window.onpopstate = null
		const path = '/' + document.location.pathname.split('/').slice(1, 3).join('/')
		history.replaceState(null, '', path)
		document.removeEventListener('keydown', this.keyDownHandle)
		this.background.removeEventListener('click', this.clickHandle)
		await this.background.Fade_Effect.hide()
		this.body.removeChild(this.background)
	}


	responsiveImageHeight = () => {
		let frame_height = parseInt(this.background.clientHeight * 0.81)
		if (this.img.clientHeight > frame_height) {
			frame_height += 'px'
			this.div_img.style.width = 'min-content'
			this.img_blur.style.width = 'auto'
			this.img_blur.style.height = frame_height
			this.img.style.width = 'auto'
			this.img.style.height = frame_height
			return
		} else if (this.img.clientHeight == frame_height)
			if (this.img.clientWidth <= this.background.clientWidth * 0.9)
				return

		let width_img = frame_height * this.img.clientWidth / this.img.clientHeight
		if (width_img < this.background.clientWidth * 0.9) {
			width_img = parseInt(width_img) + 'px'
			this.img_blur.style.height = 'auto'
			this.img_blur.style.width = width_img
			this.img.style.height = 'auto'
			this.img.style.width = width_img
		} else {
			this.div_img.style.width = '90%'
			this.img_blur.style.height = 'auto'
			this.img_blur.style.width = '100%'
			this.img.style.height = 'auto'
			this.img.style.width = '100%'
		}
	}


	keyDownHandle = e => {
		switch (e.key) {
			case 'Enter':
			case ' ':
			case 'Escape':
				this.remove()
		}
	}


	clickHandle = e => {
		if (e.target.tagName != 'IMG')
			this.remove()
	}
}