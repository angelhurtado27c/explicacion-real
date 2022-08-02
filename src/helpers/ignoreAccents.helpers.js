module.exports = function ignoreAccents(txt) {
	if (!txt) return

	txt = txt.toLowerCase()

	txt = txt.replace(/[aàáâãäå]/g, '[aàáâãäå]')
	txt = txt.replace(/[eèéêë]/g, '[eèéêë]')
	txt = txt.replace(/[iìíîï]/g, '[iìíîï]')
	txt = txt.replace(/nñ/g, '[nñ]')
	txt = txt.replace(/[oòóôõö]/g, '[oòóôõö]')
	return txt.replace(/[uùúûü]/g, '[uùúûü]')
}