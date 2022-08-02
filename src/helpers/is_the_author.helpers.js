function is_the_author(user_name, publication) {
	const authors = publication.authors
	const is_author = authors.includes(user_name) ? true : false
	return is_author
}




module.exports = is_the_author