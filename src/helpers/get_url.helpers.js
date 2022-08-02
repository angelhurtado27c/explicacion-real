function get_url(url) {
	if (!url)
		return ''

	url = url.toLowerCase()

	url = url.replace(/[àáâãäå]/g, 'a')
	url = url.replace(/[èéêë]/g, 'e')
	url = url.replace(/[ìíîï]/g, 'i')
	url = url.replace(/ñ/g, 'n')
	url = url.replace(/[òóôõö]/g, 'o')
	url = url.replace(/[ùúûü]/g, 'u')

	url = url.replace(/\W+/g, ' ')
	url = url.replace(/_+/g, ' ')
	url = url.replace(/^\s+/g, '')
	url = url.replace(/\s+$/g, '')
	url = url.replace(/\s+/g, '_')

	return url
}




module.exports = get_url