function getPositionAuthors() {
	const authors = []
	for (let author of $authors_scroll.children)
		authors.push({
			left: author.offsetLeft,
			right: author.offsetLeft + author.offsetWidth
		})
	return authors
}
const positionAuthors = getPositionAuthors()
const l_pA = positionAuthors.length




function halfTag(dir) {
	const authors_scroll = $authors_scroll.scrollLeft

	if (dir == 'left') {
		for (let i_pA = l_pA-1; i_pA > -1; i_pA--) {
			let half_tag = positionAuthors[i_pA].left <
				authors_scroll
			if (half_tag) return positionAuthors[i_pA]
		}
		return positionAuthors[0]
	}

	// right
	const authors_width = $authors_scroll.offsetWidth
	for (let i_pA = 0; i_pA < l_pA; i_pA++) {
		let half_tag = positionAuthors[i_pA].right >
			authors_scroll + authors_width - 25
		if (half_tag) return positionAuthors[i_pA]
	}
	return positionAuthors[l_pA-1]
}


function littleMove(dir, position_author) {
	const authors_scroll = $authors_scroll.scrollLeft
	const authors_width = $authors_scroll.offsetWidth

	const middle_point = authors_scroll + authors_width/2

	const little_move = dir == 'right' ?
		middle_point >= position_author.left
		: middle_point < position_author.right

	return little_move
}


function scroll(dir) {
	const authors_scroll = $authors_scroll.scrollLeft
	const position_author = halfTag(dir)
	const l_m = littleMove(dir, position_author)

	const right = dir == 'right'
	let left = authors_scroll
	if (l_m)
		left += right ? 90 : -90
	else
		left = right ? position_author.left - 50
			: position_author.right + 50
				- $authors_scroll.offsetWidth
	$authors_scroll.scroll({left, behavior: 'smooth'})
}
$authors_scroll.scroll(0, 0)

$btn_authors_left.addEventListener('click', () => {scroll('left')})
$btn_authors_right.addEventListener('click', () => {scroll('right')})

window.addEventListener('resize', disappear)

$authors_scroll.addEventListener('scroll', disappear)
let i = 0
function disappear() {
	const scroll = $authors_scroll.scrollLeft
	const scrollMax = $authors_scroll.scrollWidth - $authors_scroll.offsetWidth
	// const scrollMax = $authors_scroll.scrollWidth - getWidth($authors_scroll)

	$authors_scroll.style.justifyContent = scrollMax ? 'left' : 'center'

	$btn_authors_left.className = scroll > 0 ? '' : 'disappear'
	$btn_authors_right.className = Math.round(scroll) < scrollMax ? '' : 'disappear'
}
disappear()

/*
scroll,
$authors_scroll.scrollWidth - $authors_scroll.offsetWidth,
$authors_scroll.offsetWidth

function getWidth(element) {
	const style = window.getComputedStyle(element)
	const width = parseInt(style.width)
		- parseInt(style.paddingLeft)
		- parseInt(style.paddingRight)
	return width
}
*/