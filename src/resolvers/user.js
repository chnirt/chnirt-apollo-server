import mongoose from 'mongoose'
import { User } from '../models'
import { UserInputError } from 'apollo-server-express'
import { signUp, signIn } from '../schemas'
import Joi from 'joi'
import * as Auth from '../auth/auth'
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
		users: async (parent, args, { req }, info) => {
			// TODO: auth, projection, pagination

			Auth.checkSignedIn(req)

			return await User.find()
		},
		user: async (parent, { _id }, { req }, info) => {
			// TODO: auth, projection, sanitization

			Auth.checkSignedIn(req)

			if (!mongoose.Types.ObjectId.isValid(_id)) {
				throw new UserInputError(`${_id} is not a valid user ID.`)
			}
			return await User.findById({
				_id
			})
		}
	},
	Mutation: {
		register: async (parent, { userInput }, { req, pubsub }, info) => {
			// TODO: not auth, validation

			Auth.checkSignedOut(req)

			await Joi.validate(userInput, signUp, { abortEarly: false })

			const user = await User.create(userInput)
			console.log(user._id)

			req.session.userId = user._id

			pubsub.publish('newUser', {
				newUser: user
			})

			return user
		},
		login: async (parent, { userInput }, { req }, info) => {
			// TODO: check session
			const { userId } = req.session

			if (userId) {
				return await User.findById(userId)
			}

			await Joi.validate(userInput, signIn, { abortEarly: false })

			const { email, password } = userInput

			const user = await Auth.attemptSignIn(email, password)

			req.session.userId = user._id

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
		logout: async (parent, args, { req, res }, info) => {
			Auth.checkSignedIn(req)

			return Auth.signOut(req, res)
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
