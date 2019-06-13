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
			expiresIn: '15s'
		}
	)

	const refreshToken = await jwt.sign(
		{
			iss: 'chnirt',
			sub: user._id
		},
		process.env.SECRET_KEY,
		{
			expiresIn: '30s'
		}
	)

	return { token, refreshToken }
}

export const tradeTokens = async (email, password) => {
	const message = 'Incorrect email or password. Please try again.'
	const user = await User.findOne({ email })

	if (!user || !(await user.matchesPassword(password))) {
		throw new AuthenticationError(message)
	}

	return await generateToken(user)
}

export const refreshTokens = async refreshToken => {
	let userId = -1
	try {
		const decodeRefreshToken = await jwt.verify(
			refreshToken,
			process.env.SECRET_KEY
		)
		userId = decodeRefreshToken.sub
	} catch (err) {
		return {}
	}

	const user = await User.findOne({ _id: userId })

	return await generateToken(user)
}

export const verifyTokens = async (token, refreshtoken) => {
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
		// try to retrieve a user with the refreshtoken
		const decodeRefreshToken = await jwt.verify(
			refreshtoken,
			process.env.SECRET_KEY
		)

		currentUser = await User.findOne({ _id: decodeRefreshToken.sub })

		const { token, refreshToken } = await refreshTokens(refreshtoken)
		// console.log('TCL: verifyTokens -> refreshToken', refreshToken)
		// console.log('TCL: verifyTokens -> token, refreshToken', token)
	}

	// add the user to the context
	return currentUser
}
