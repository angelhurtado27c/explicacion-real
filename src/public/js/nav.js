// Resaltado de coincidencia
// Enviar 7 resultados
// Mostrar mensaje no encontrado
// create_article.js has code that modifies the nav, on line 14

import {render_math} from './modules/render_math.js'
import ChangeView from './modules/ChangeView.js'


class Searcher {
	constructor() {
		this.form = $search.parentNode
		this.search_sugg = $search_suggestions.children
		$search_suggestions.in_screen = false
		this.i_preselect_sugg = -1 // -1 is original query
		this.original_search = ''
		this.new_preselect_sug = false
		// this.preselect_suggestion = null
		// this.new_highlighted_messages = false
		$search_suggestions.style.display = 'none'
		$reset_search.addEventListener('click', e => {
			e.preventDefault()
			$search.value = ''
			$reset_search.style.display = 'none'
			$search.focus()
		})
		$search.addEventListener('input', this.onFinishWriting)
		$search.addEventListener('keyup', this.showResults)
		$search.addEventListener('keydown', this.searchKeyHandler)
		$search.addEventListener('focus', this.searchFocus)
		$search_suggestions.addEventListener(
			'mousemove', this.searchMouseMoveHandler)
		$search_suggestions.addEventListener(
			'mouseout', this.searchMouseOutHandler)
		document.addEventListener('click', this.documentClickHandler)
	}

	searchKeyHandler = e => {
		let i_s_s = 0
		switch (e.key) {
			case 'ArrowDown': i_s_s++; break
			case 'ArrowUp': i_s_s--; break
			case 'Enter': this.showResults(); break
			case 'Tab':
			case 'Escape': this.hide_suggestions()
			default: return
		}
		const length = this.search_sugg.length
		if (!length) return

		const i_p_s = this.i_preselect_sugg
		i_s_s += i_p_s
		const s_s = this.search_sugg
		if (i_p_s != -1)
			s_s[i_p_s].classList.remove('preselect_sugg')

		switch (i_s_s) {
			case -2: i_s_s = length-1; break
			case length: i_s_s = -1; break
		}
		let search_value = this.original_search
		if (i_s_s != -1) {
			s_s[i_s_s].classList.add('preselect_sugg')
			search_value = s_s[i_s_s].innerText
		}

		if (this.timeout_search) this.new_preselect_sug = true
		else $search.value = search_value

		this.i_preselect_sugg = i_s_s

		/*
		const key = e.key
		let move_suggestion
		if (key == 'Enter')
			return e.preventDefault()
		else if (key == 'ArrowDown')
			move_suggestion = 1
		else if (key == 'ArrowUp')
			move_suggestion = -1

		if (!(move_suggestion && $search.value)) return

		if (this.timeout_search)
			this.new_highlighted_messages = true

		e.preventDefault()
		const length = this.search_sugg.length
		if (!length) return

		let i_item = this.preselect_sugg
		if (i_item != null)
			this.search_sugg[i_item]
				.classList.remove('preselect_sugg')
		else
			i_item = move_suggestion == 1 ? -1 : length
		i_item += move_suggestion

		if (0 > i_item)
			i_item = null //length-1
		else if (length-1 < i_item)
			i_item = null //0

		if (i_item != null) {
			const item = this.search_sugg[i_item]
			item.classList.add('preselect_suggestion')
			//$search.value = item.innerText
		}
		this.preselect_suggestion = i_item
		*/
	}

	searchFocus = () => {
		if (!$search.value) return
		if (!this.search_sugg.length)
			return this.showSuggestions()
		$search_suggestions.style.display = 'block'
		$search_suggestions.in_screen = true
		this.form.style.borderRadius = '7px 7px 0 0'
		this.i_preselect_sugg = -1
		//console.log($search_suggestions.in_screen)
	}

	searchMouseMoveHandler = e => {
		let target = e.target
		if (target == $search_suggestions) return

		const t_n = target.localName
		if (t_n == 'img' || t_n == 'span')
			target = target.parentNode
		target = target.parentNode

		const s_s = this.search_sugg
		let i = this.i_preselect_sugg
		s_s[i != -1 ? i : 0].classList.remove('preselect_sugg')

		const len = s_s.length
		for (i = 0; i < len; i++)
			if (s_s[i] == target) {
				s_s[i].classList.add('preselect_sugg')
				this.i_preselect_sugg = i
				break
			}
	}

	searchMouseOutHandler = () => {
		const i_p_s = this.i_preselect_sugg
		if (i_p_s == -1) return
		this.search_sugg[i_p_s].classList.remove('preselect_sugg')
		this.i_preselect_sugg = -1
	}

	documentClickHandler = e => {
		if (!$search_suggestions.in_screen) return

		const target = e.target

		if (target.localName == 'img')
			if (target.parentNode.className == 'divRowUp')
				return this.upSugg(target.parentNode.parentNode)
		if (target.className  == 'divRowUp')
			return this.upSugg(target.parentNode)

		const elements_to_ignore = [
			$search,
			$btn_search,
			$btn_search.children[0]
		]
		for (let element of elements_to_ignore)
			if (target == element) return

		$search_suggestions.style.display = 'none'
		$search_suggestions.in_screen = false
		this.hide_suggestions()
	}

	upSugg = sugg => {
		$search.value = sugg.innerText
		this.showSuggestions()
		$search.focus()
	}

	onFinishWriting = () => {
		clearTimeout(this.timeout_search)
		if ($search.value) {
			$reset_search.style.display = 'block'
		} else {
			$reset_search.style.display = 'none'
		}
		this.timeout_search = setTimeout(this.showSuggestions, 210)
	}

	hide_suggestions() {
		$search_suggestions.style.display = 'none'
		$search_suggestions.in_screen = false
		this.form.style.borderRadius = '7px'
		this.i_preselect_sugg = -1
		//this.preselect_suggestion = null
	}

	showSuggestions = async () => {
		this.timeout_search = null

		this.original_search = $search.value
		if (!$search.value) {
			$search_suggestions.innerHTML = ''
			return this.hide_suggestions()
		}

		const suggestions = await this.getSuggestions()
		if (0 == suggestions.posts.length + suggestions.users.length)
			return this.hide_suggestions()
		$search_suggestions.style.display = 'block'
		$search_suggestions.in_screen = true
		this.form.style.borderRadius = '7px 7px 0 0'

		$search_suggestions.innerHTML = ''

		/*
		for (let post_title of suggestions.posts) {
			const post = document.createElement('div')

			const a = document.createElement('a')
			a.href = '/'
			a.innerText = post_title

			const imgRowUp = document.createElement('img')
			imgRowUp.src = '/img/ico/rowUp.svg'
			const divImg = document.createElement('div')
			divImg.className = 'divRowUp'
			divImg.appendChild(imgRowUp)

			post.appendChild(a)
			post.appendChild(divImg)
			$search_suggestions.appendChild(post)
		}
		*/

		this.layoutSuggs(suggestions.posts)
		this.layoutSuggs(suggestions.users)

		/*
		for (let user_data of suggestions.users) {
			const user = document.createElement('a')
			user.href = '/'

			const user_name = document.createElement('p')
			user_name.innerText = user_data.name
			user.appendChild(user_name)

			const user_job = document.createElement('p')
			user_job.innerText = user_data.job
			user.appendChild(user_job)

			$search_suggestions.appendChild(user)
		}
		*/

		if (this.new_preselect_sug) {
			this.new_preselect_sug = false
			let i_p_s = this.i_preselect_sugg
			const s_s = this.search_sugg
			const length = s_s.length-1
			if (i_p_s > length) i_p_s = length
			if (i_p_s != -1)
				s_s[i_p_s].classList.add('preselect_sugg') // bug
			this.i_preselect_sugg = i_p_s
		} else this.i_preselect_sugg = -1

		/*
		if (this.new_highlighted_messages) {
			this.new_highlighted_messages = false

			if (!this.preselect_suggestion)
				this.preselect_suggestion = 0

			this.search_sugg[this.preselect_suggestion]
				.classList.add('preselect_suggestion')
		}
		*/
	}

	layoutSuggs(suggs) {
		for (let sugg of suggs) {
			const div_sugg = document.createElement('div')

			const a = document.createElement('a')
			const query = sugg.replaceAll('+', '%2b').replaceAll(' ', '+')
			a.href = `/search?q=${query}`
			const span = document.createElement('span')
			span.innerText = sugg
			a.appendChild(span)

			const imgRowUp = document.createElement('img')
			imgRowUp.src = '/img/ico/rowUp.svg'
			const divImg = document.createElement('div')
			divImg.className = 'divRowUp'
			divImg.appendChild(imgRowUp)

			div_sugg.appendChild(a)
			div_sugg.appendChild(divImg)
			$search_suggestions.appendChild(div_sugg)
		}
	}

	async getSuggestions() {
		const query = $search.value.replaceAll('+', '%2b').replaceAll(' ', '+')
		let res = await fetch(`/complete?q=${query}`)
		return await res.json()
	}

	showResults = e => {
		if ((e ? e.key == 'Enter' : true) && $search.value) {
			clearTimeout(this.timeout_search)
			this.timeout_search = null
			const query = $search.value.replaceAll('+', '%2b').replaceAll(' ', '+')
			location.href = `/search?q=${query}`
		}
	}
}




class SearcherViewHandler {
	constructor() {
		this.searcher = new Searcher

		$new.active = true
		if (window.location.pathname == '/new') {
			$new.style.display = 'none'
			$new.active = false
		}

		const Change_view = new ChangeView(
			/* small default */
			() => {
				const width = `${$options.children.length * 100}%`
				$options.style.width = width
				$reset_search.style.display = 'none'
				this.active_search()
			},

			/* big default */
			() => {
				if ($options.children.length == 3)
					$options.style.width = '150%'
				$btn_search.onclick = this.search
				if ($search.value) $reset_search.style.display = 'block'
			},

			/* small change */
			() => {
				const width = `${$options.children.length * 100}%`
				$options.style.width = width
				//this.style == 'search_mobile' ||
				const search_focus = document.activeElement.id == '$search'
				if (search_focus || $search_suggestions.in_screen) {
					this.show_mobile_searcher()
				} else {
					this.active_search()
					$reset_search.style.display = 'none'
				}
			},

			/* big change */
			() => {
				if ($options.children.length == 3)
					$options.style.width = '150%'
				else
					$options.style.width = '100%'
				$btn_search.onclick = this.search
				this.default_searcher()
				$reset_search.style.display = $search.value ? 'block' : 'none'
			}
		)

		$btn_return.onclick = e => {
			e.preventDefault()
			//this.style = 'default'
			this.active_search()
			this.default_searcher()
			$reset_search.style.display = 'none'
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
		if ($new.active) $new.style.display = 'block'
		$btn_return.style.display = ''
		$search.style.display = ''
	}




	search = e => {
		e.preventDefault()
		this.searcher.showResults()
	}

	active_search = () => {
		$btn_search.onclick = e => {
			e.preventDefault()
			//this.style = 'search_mobile'
			$reset_search.style.display = $search.value ? 'block' : 'none'
			$btn_search.onclick = this.search
			const length = $search.value.length
			$search.selectionStart = length
			$search.selectionEnd = length
			this.show_mobile_searcher()
		}
	}
}




const Searcher_view_handler = new SearcherViewHandler