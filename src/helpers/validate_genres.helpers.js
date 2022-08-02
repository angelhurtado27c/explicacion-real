function validate_genres(genres) {
	for (let gender of genres)
		if (gender != onlyFirstLetterUppercase(gender))
			return false
	// areNotRepeatingElements
	return genres.length == new Set(genres).size && genres.length > 0
}

function onlyFirstLetterUppercase(txt) {	
	txt = txt.replace(/^\s+/, '')
	txt = txt.replace(/\s+$/, '')
	txt = txt.replace(/\s+/, ' ')
	
	txt = txt.toLowerCase()
	return txt.substring(0, 1).toUpperCase() + txt.substring(1)
}

module.exports = validate_genres