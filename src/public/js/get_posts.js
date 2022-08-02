async function getPosts() {
	const a_width_ids = document.querySelectorAll('main article>a')
	const ids = []
	for (let a_id of a_width_ids)
		ids.push( a_id.href.match(/\w*$/)[0] )

	const res = await fetch('posts', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(ids)
	})

	const new_posts = await res.json()
	console.log(new_posts)
}

getPosts()