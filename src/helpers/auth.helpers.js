const helpers = {}




helpers.if_auth_next = (req, res, next) => {
	is_auth(req, res, next)
}

helpers.if_not_auth_next = (req, res, next) => {
	is_auth(req, res, next, true)
}


function is_auth(req, res, next, inver=false) {
	if (inver ^ req.isAuthenticated())
		return next()
	res.redirect('/')
}




module.exports = helpers