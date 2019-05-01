import { AuthenticationError } from 'apollo-server-express'
import jwt from 'jsonwebtoken'
import { User } from '../models'

export const tokenTrade = async (email, password) => {
	const message = 'Incorrect email or password. Please try again.'
	const user = await User.findOne({ email })

	if (!user || !(await user.matchesPassword(password))) {
		throw new AuthenticationError(message)
	}

	const token = jwt.sign(
		{
			iss: 'Chnirthgram',
			sub: user._id
		},
		process.env.SECRET_KEY,
		{
			expiresIn: '30d'
		}
	)

	return token
}

export const verifyToken = async req => {
	// get the user token from the headers
	const token = req.headers.authorization.split(' ')[1]

	// try to retrieve a user with the token
	const decodeToken = await jwt.verify(token, process.env.SECRET_KEY)

	const currentUser = await User.findOne({ _id: decodeToken.sub })

	// optionally block the user
	// we could also check user roles/permissions here
	if (!currentUser) throw new AuthorizationError('You must be logged in')

	// add the user to the context
	return currentUser
}
