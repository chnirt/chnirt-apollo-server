import mongoose from 'mongoose'
import { User } from '../models'
import { UserInputError } from 'apollo-server-express'
import { signUp, signIn } from '../schemas'
import Joi from 'joi'
import * as Auth from '../auth/auth'
import { attemptSignIn, signOut } from '../auth/auth'
import jwt from 'jsonwebtoken'

export default {
	Subscription: {
		newUser: {
			subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('newUser')
		}
	},
	Query: {
		me: async (parent, args, { req }) => {
			// TODO: ensure login, projection
			// DONE:
			return await User.findById(req.session.userId)
		},
		users: async (parent, args, { req }, info) => {
			// TODO: projection, pagination
			// DONE:
			return await User.find()
		},
		user: async (parent, { _id }, { req }, info) => {
			// TODO: auth, projection, sanitization
			// DONE:
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
			// TODO: ensure logout, validation
			// DONE:

			await Joi.validate(userInput, signUp, { abortEarly: false })

			const user = await User.create(userInput)

			req.session.userId = user._id

			pubsub.publish('newUser', {
				newUser: user
			})

			return user
		},
		login: async (parent, { userInput }, { req }, info) => {
			// TODO: ensure logout, check session
			// DONE:
			const { userId } = req.session

			if (userId) {
				const token = await jwt.sign(
					{
						iss: 'Chnirt',
						sub: userId
					},
					process.env.SECRET_KEY,
					{
						expiresIn: '30d'
					}
				)

				return {
					userId: userId,
					token: token,
					tokenExpiration: '30d'
				}
			}

			await Joi.validate(userInput, signIn, { abortEarly: false })

			const { email, password } = userInput

			const user = await attemptSignIn(email, password)

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
			// TODO: ensure login
			// DONE:
			return signOut(req, res)
		},
		deleteMany: async () => {
			// TODO: delete all
			// DONE:
			const rsUser = await User.deleteMany()
			return rsUser ? true : false
		}
	},
	User: {
		firstLetterOfEmail: parent => parent.email[0]
	}
}
