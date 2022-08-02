class ModifyText {
	highlightMatch(txt, match) {
		txt = txt.toLowerCase()
		const remaining_txt = txt.split(new RegExp(this.ignoreAccents(match)))
		match = txt.matchAll(new RegExp(this.ignoreAccents(match), 'g'))
		const highlighted = []
	
		let txt_start = remaining_txt[0] ? remaining_txt[0] : match.next().value[0]
		txt_start = this.onlyFirstLetterUppercase(txt_start)
		if (remaining_txt[0])
			highlighted.push(document.createTextNode(txt_start))
		else
			highlighted.push(
				this.spanBold(txt_start),
				document.createTextNode(remaining_txt[1])
			)
	
		const limit = remaining_txt.length
		for (let i_t = remaining_txt[0] ? 1 : 2; i_t < limit; i_t++)
			highlighted.push(
				this.spanBold(match.next().value[0]),
				document.createTextNode(remaining_txt[i_t])
			)
	
		return highlighted
	}


	spanBold(txt) {
		const span = document.createElement('span')
		span.className = 'bold'
		span.innerText = txt
		return span
	}


	removeAccents(txt) {
		txt = txt.toLowerCase()

		txt = txt.replace(/[àáâãäå]/g, 'a')
		txt = txt.replace(/[èéêë]/g, 'e')
		txt = txt.replace(/[ìíîï]/g, 'i')
		txt = txt.replace(/[òóôõö]/g, 'o')
		txt = txt.replace(/[ùúûü]/g, 'u')

		return this.optimizeSpaces(txt)
	}


	ignoreAccents(txt) {
		txt = txt.toLowerCase()

		txt = txt.replace(/a/g, '[aàáâãäå]')
		txt = txt.replace(/e/g, '[eèéêë]')
		txt = txt.replace(/i/g, '[iìíîï]')
		txt = txt.replace(/o/g, '[oòóôõö]')
		txt = txt.replace(/u/g, '[uùúûü]')

		return this.optimizeSpaces(txt)
	}


	onlyFirstLetterUppercase(txt) {
		txt = txt.toLowerCase()
		return txt.substring(0, 1).toUpperCase() + txt.substring(1)
	}

	optimizeSpaces(txt) {
		txt = txt.replace(/^\s+/, '')
		txt = txt.replace(/\s+$/, '')
		txt = txt.replace(/\s+/, ' ')
		return txt
	}
}

const modifyText = new ModifyText
export {modifyText}