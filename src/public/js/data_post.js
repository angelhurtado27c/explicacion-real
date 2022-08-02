$button_heart.addEventListener('click', async () => {
	const log_in = $button_heart.dataset.log_in == 'true'
	if (!log_in) window.location = '/log_in'

	const url = `/heart${window.location.pathname}`
	const heart = await fetch(url, {method: 'POST'})

	const mark_heart = await heart.text()
	const hearts = parseInt($heart.innerText)

	if (mark_heart == '1') {
		$heart.innerText = hearts + 1
		$path_heart.style.fill = '#E01B24'
	} else if (mark_heart == '0') {
		$heart.innerText = hearts - 1
		$path_heart.style.fill = '#F6F0ED'
	} else
		$heart.innerText = mark_heart
})