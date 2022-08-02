export function is_empty(map) {
	for (let key in map)
		return false
	return true
}