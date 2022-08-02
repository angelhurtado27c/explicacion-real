const {connect} = require('mongoose')

const {DB_HOST, DB_PORT, DB_NAME} = process.env
const DB_URI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`

connect(DB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true // habilita unique
})
	.then(db => {console.log('db connected')})
	.catch(err => {console.log(err)})