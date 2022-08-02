import {modifyText} from './modules/ModifyText.js'

// search, add and edit the genre list
// The genre upload is in create_article.js
class GenreHandler {
	constructor() {
		this.gender_list = $gender_list.querySelectorAll('.check_text')
		this.gender_list = Array.from(this.gender_list)
		this.$new_gender = this.gender_list.shift()
		this.parent_newGender = this.$new_gender.parentNode.parentNode
		this.parent_newGender.style.display = 'none'
		for (let input of $gender_list.querySelectorAll('input'))
			input.onchange = () => {if ($gender_search.value) $gender_search.focus()}
		$addGender.addEventListener('change', this.addOptionGender)

		$gender_search.value = ''
		$gender_search.addEventListener('input', this.onFinishWriting)
		$gender_search.addEventListener('keyup', this.checkGender)
	}

	onFinishWriting = () => {
		clearTimeout(this.timeout_search_gender)
		this.timeout_search_gender = setTimeout(this.searchGender, 210)
	}

	searchGender = () => {
		this.timeout_search_gender = null
		const search = modifyText.removeAccents($gender_search.value)

		if (!search) {
			this.hideOption()
			for (let item of this.gender_list) {
				item.innerText = item.innerText
				item.innerText = item.innerText // err
				item.parentNode.parentNode.style.display = 'list-item'
			}
			return
		}

		this.newGender()

		let item_text, match, li
		const search_re = new RegExp(search)
		for (let item of this.gender_list) {
			item_text = item.innerText
			li = item.parentNode.parentNode

			match = search_re.test(modifyText.removeAccents(item_text))
			if (match) {
				item.innerHTML = ''
				for (let text of modifyText.highlightMatch(item_text, search))
					item.appendChild(text)
				li.style.display = 'list-item'
			} else
				li.style.display = 'none'
		}
	}

	genderListHaveTheSearch() {
		const exact_search = modifyText
			.onlyFirstLetterUppercase($gender_search.value)
		for (let item of this.gender_list)
			if (exact_search == item.innerText) return true
		return exact_search
	}

	newGender() {
		const exact_search = this.genderListHaveTheSearch()
		if (exact_search == true)
			this.hideOption()
		else
			this.showOption(exact_search)
	}

	showOption(gender) {
		this.$new_gender.innerText = gender
		this.parent_newGender.style.display = 'list-item'
	}

	hideOption() {
		this.parent_newGender.style.display = 'none'
		$addGender.checked = false
	}

	addOptionGender = () => {
		this.hideOption()
		const value = this.$new_gender.innerHTML
		const item_gender = this.createOptionItem(value)
		const first_child = $gender_list.children[1]
		$gender_list.insertBefore(item_gender.li, first_child)
		this.gender_list.push(item_gender.check_text)
		$gender_search.focus()
	}

	createOptionItem(value) {
		const $new_gender = document.createElement('li')

		const label = document.createElement('label')
		label.className = 'check'

		const input = document.createElement('input')
		input.type = 'checkbox'
		input.checked = true

		const span_checkmarck = document.createElement('span')
		span_checkmarck.className = 'checkmark'

		const span_check_text = document.createElement('span')
		span_check_text.className = 'check_text'
		span_check_text.innerText = value

		$new_gender.appendChild(label)
		label.appendChild(input)
		label.appendChild(span_checkmarck)
		label.appendChild(span_check_text)

		return {
			li: $new_gender,
			check_text: span_check_text
		}
	}

	checkGender = e => {
		if (e.key == 'Enter' && $gender_search.value) {
			if (this.genderListHaveTheSearch() == true) return

			if (!this.timeout_search_gender)
				return this.addOptionGender()

			clearTimeout(this.timeout_search_gender)
			this.searchGender()
			this.addOptionGender()
		}
	}
}

new GenreHandler