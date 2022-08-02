class ChangeView {
	constructor(
			small_default, big_default,
			small_change, big_change
	) {
		const display_width = window.innerWidth
		this.is_small = display_width < 680 ? true : false
		this.small_change = small_change
		this.big_change = big_change
		
		window.onresize = this.change
		
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




class SearcherViewHandler {
	constructor() {
		const Change_view = new ChangeView(
			/* small default */
			this.active_search,

			/* big default */
			() => {$btn_search.onclick = this.search},

			/* small change */
			() => {
				if (this.style == 'search_mobile')
					this.show_mobile_searcher()
				else
					this.active_search()
			},

			/* big change */
			() => {
				$btn_search.onclick = this.search
				this.default_searcher()
			}
		)

		$btn_return.onclick = e => {
			e.preventDefault()
			this.style = 'default'
			this.active_search()
			this.default_searcher()
		}
	}




	show_mobile_searcher() {
		$options.style.display = 'none'
		$new.style.display = 'none'
		$btn_return.style.display = 'block'
		$search.style.display = 'block'
		$search.focus()
	}

	default_searcher() {
		$options.style.display = 'flex'
		$new.style.display = 'block'
		$btn_return.style.display = ''
		$search.style.display = ''
	}




	search = e => {
		e.preventDefault()
		console.log(this, 'buscando')
	}

	active_search = () => {
		$btn_search.onclick = e => {
			e.preventDefault()
			this.style = 'search_mobile'
			$btn_search.onclick = this.search
			this.show_mobile_searcher()

		}
	}
}




const Searcher_view_handler = new SearcherViewHandler