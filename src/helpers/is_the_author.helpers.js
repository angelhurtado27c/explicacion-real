function is_the_author(user_id, publication) {
	const authors = publication.authors
	const is_author = authors.includes(user_id) ? true : false
	return is_author
}




module.exports = is_the_author