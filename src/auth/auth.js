import { AuthenticationError } from 'apollo-server-express'
import jwt from 'jsonwebtoken'
import { User } from '../models'

export const generateToken = async user => {
	const token = await jwt.sign(
		{
			iss: 'chnirt',
			sub: user._id
		},
		process.env.SECRET_KEY,
		{
			expiresIn: '30d'
		}
	)

	return { token }
}

export const tradeTokens = async (email, password) => {
	const message = 'Incorrect email or password. Please try again.'
	const user = await User.findOne({ email })

	if (!user || !(await user.matchesPassword(password))) {
		throw new AuthenticationError(message)
	}

	return await generateToken(user)
}

export const verifyTokens = async token => {
	let currentUser
	try {
		// try to retrieve a user with the token
		const decodeToken = await jwt.verify(token, process.env.SECRET_KEY)

		currentUser = await User.findOne({
			_id: decodeToken.sub
		})

		// optionally block the user
		// we could also check user roles/permissions here
		if (!currentUser) throw new AuthorizationError('You must be logged in')
	} catch (error) {
		throw new AuthenticationError('Your token is invalid.')
	}

	// add the user to the context
	return currentUser
}
