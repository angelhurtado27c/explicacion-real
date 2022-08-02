function is_empty(map) {
	for (let key in map)
		return false
	return true
}




module.exports = is_empty