export default async function scrollTo(element) {
	const scrollY = window.scrollY

	const elementMeasurements = element.getBoundingClientRect()
	const elementY = elementMeasurements.y
	const elementHeight = elementMeasurements.height

	const heightVisibleWindow = document.documentElement.clientHeight

	const elementPositionAbsoluteY = scrollY + elementY
	const elementCenter = elementPositionAbsoluteY - ((heightVisibleWindow - elementHeight) / 2)

	scroll({
		top: elementCenter,
		behavior: "smooth"
	})
	element.focus({preventScroll:true})
}

//document.body.offsetHeight