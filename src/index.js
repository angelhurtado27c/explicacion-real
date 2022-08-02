require('dotenv').config()
require('./database')
require('./server')

/*
db.publications.update(
	{title: "JavaScript"},
	{$set: {
		authors: ["60be977819e2b520e02c467e", "60be58b093058014cc7b7a19"]
	}}
)

Estudiar Node JS puro con Mirchar

https://nodejs.dokry.com/node.js/subdominio

const hostname = req.headers.host.split(":")[0]
console.log(hostname)
if (hostname == "sub1.domain.com")
	res.send("this is sub1 response!")
else if (hostname == "sub2.domain.com")
	res.send("this is sub2 response!")
else if (hostname == 'angel.localhost')
	res.send('Hi Ángel')
*/

/*
medallas
carrusel doble se sugerencias como youtube tv
https://masteringjs.io/tutorials/mongoose/update
https://cybmeta.com/prevenir-que-una-palabra-se-salga-de-su-contenedor
*/