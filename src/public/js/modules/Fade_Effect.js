export default function fadeEffect(element) {
	element.Fade_Effect = new Fade_Effect(element)
}


class Fade_Effect {
	constructor(element) {
		this.element = element
		this.element.style.opacity = '0'
		this.body = document.getElementsByTagName('body')[0]
	}


	show() {
		return new Promise(async res => {
			this.element.style.transition = 'opacity 1s ease'
			this.element.style.opacity = '1'
			await this.wait(950)
			res()
		})
	}


	hide() {
		return new Promise(async res => {
			this.element.style.opacity = '0'
			await this.wait(900)
			this.body.style.overflow = ''
			res()
		})
	}


	wait(time) {return new Promise(res => setTimeout(res, time))}
}