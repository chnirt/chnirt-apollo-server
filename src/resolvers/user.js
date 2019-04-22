import mongoose from 'mongoose'
import { User } from '../models'
import { UserInputError } from 'apollo-server-express'
import { signUp, signIn } from '../schemas'
import Joi from 'joi'
import Auth from '../auth/auth'
import jwt from 'jsonwebtoken'

export default {
	Subscription: {
		newUser: {
			subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('newUser')
		}
	},
	Query: {
		me: async (parent, args, { req }) => {
			// TODO: projection
			Auth.checkSignedIn(req)

			return await User.findById(req.session.userId)
		},
		users: async (parent, args, context, info) => {
			// TODO: auth, projection, pagination
			return await User.find()
		},
		user: async (parent, { _id }, context, info) => {
			// TODO: auth, projection, sanitization
			if (!mongoose.Types.ObjectId.isValid(_id)) {
				throw new UserInputError(`${_id} is not a valid user ID.`)
			}
			return await User.findById({
				_id
			})
		}
	},
	Mutation: {
		login: async (parent, { userInput }, { req }, info) => {
			// TODO: check session
			// const { userId } = req.session.userId

			// if (userId) {
			// 	return await User.findById(req.session.userId)
			// }

			await Joi.validate(userInput, signIn, { abortEarly: false })

			const { email, password } = userInput

			const user = await Auth.attemptSignIn(email, password)

			// if (!user) {
			// 	const error = new Error('No user with that email')
			// 	error.status = 409
			// 	throw error
			// }

			// const isMatch = await user.matchesPassword(password)
			// if (!isMatch) {
			// 	const error = new Error('Unauthorized')
			// 	error.status = 401
			// 	throw error
			// }
			const token = await jwt.sign(
				{
					iss: 'Chnirt',
					sub: user._id
				},
				process.env.SECRET_KEY,
				{
					expiresIn: '30d'
				}
			)
			return {
				userId: user._id,
				token: token,
				tokenExpiration: '30d'
			}
		},
		register: async (parent, { userInput }, { pubsub }, info) => {
			// TODO: auth, validation
			await Joi.validate(userInput, signUp, { abortEarly: false })
			const newUser = await User.create(userInput)
			pubsub.publish('newUser', {
				newUser: newUser
			})
			return newUser
		},
		deleteMany: async () => {
			// TODO: delete
			const rsUser = await User.deleteMany()
			return rsUser ? true : false
		}
	},
	User: {
		firstLetterOfEmail: parent => parent.email[0]
	}
}
