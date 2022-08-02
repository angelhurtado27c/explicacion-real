export default class ChangeView {
	constructor(
		small_default,
		big_default,
		small_change,
		big_change
	) {
		const display_width = window.innerWidth
		this.is_small = display_width < 680 ? true : false
		this.small_change = small_change
		this.big_change = big_change

		window.addEventListener('resize', this.change)

		if (this.is_small)
			small_default()
		else
			big_default()
	}

	change = () => {
		const screen = window.innerWidth
		if (!this.is_small && screen < 680) {
			this.is_small = true
			this.small_change()
		} else if (this.is_small && screen > 679) {
			this.is_small = false
			this.big_change()
		}
	}
}