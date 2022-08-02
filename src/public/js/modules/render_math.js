export function render_math() {
	renderMathInElement(document.body)
	const katex_display = document.getElementsByClassName(
		'katex-display'
	)

	for (let e of katex_display)
		e.parentNode.className = 'parent-katex-display'
}

render_math()