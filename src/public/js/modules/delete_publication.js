$delete.onclick = () => {
	$delete_msg.style.display = 'flex'
	$delete_msg.className = 'appear_delete_msg'

	$delete_no.onclick = delete_no
	$delete_ok.onclick = delete_ok
}




function delete_no() {
	disappear_delete_msg()
}

async function delete_ok() {
	const res = await fetch('/delete_publication', {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			url_article: window.location.pathname.substr(1)
		})
	})

	const was_deleted = await res.text()
	if (was_deleted == 'fail')
		return show_failed_msg()

	window.location.href = '/'
	disappear_delete_msg()
}

function show_failed_msg() {
	const p_msg = $delete_msg.children[0].children[0]
	p_msg.innerHTML = 'Ahora mismo la base de datos no está disponible, por favor intentalo más tarde'

	$delete_ok.innerHTML = 'ok'
	$delete_no.style.display = 'none'

	$delete_ok.onclick = () => {
		disappear_delete_msg()
		setTimeout(() => {
			p_msg.innerHTML = '¿Estas seguro de borrar esta publicación?'
			$delete_ok.innerHTML = 'Si'
			$delete_no.style.display = ''
			$delete_ok.onclick = delete_ok
		}, 300)
	}
}




function disappear_delete_msg() {
	$delete_msg.className = 'disappear_delete_msg'
	setTimeout(() => {
		$delete_msg.style.display = 'none'
	}, 300)
	$delete_no.onclick = null
	$delete_ok.onclick = null
}