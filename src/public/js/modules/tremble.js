// programa que elija estudiante aleatoriamente para preguntar algo

export default function tremble(element) {
	clearTimeout(element.t_tremble)
	element.classList.remove('tremble')
	element.t_tremble = setTimeout(()=>{
		element.classList.add('tremble')
	}, 1)
}