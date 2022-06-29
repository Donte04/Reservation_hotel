import jwt from 'jsonwebtoken'
import { createError } from "./error.js"

export const verifyToken = (req, res, next) => {
	const my_token = req.cookies.access_token
	if (!my_token) return next(createError(401, "You are not authenticated"));
	
	jwt.verify(my_token, process.env.JWT, (err, user) => {
		if(err) return next(createError(403, "Token is not valid"));
		req.user = user
		next()
	})
}

export const verifyUser = (req, res, next) => {
	verifyToken(req, res, next, () => {
		if (req.user.id === req.params.id || req.user.isAdmin)
		{ next() }
		else 
		{ return next(createError(403, "You are not authorized"))}
	})
}

export const verifyAdmin = (req, res, next) => {
	verifyToken(req, res, next, () => {
		if (req.user.isAdmin)
		{ next() }
		else 
		{ return next(createError(403, "You are not authorized"))}
	})
}
