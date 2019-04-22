import mongoose from 'mongoose'
import { UserInputError } from 'apollo-server-express'

const jwt = require('jsonwebtoken')

const User = require('../models/user')
const Event = require('../models/event')

export default {
	Subscription: {
		newUser: {
			subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('newUser')
		}
	},
	Query: {
		me: async (parent, args, context) => {
			if (!context.user || !context.user.roles.includes('admin')) return null
			return await context.user
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
		login: async (parent, { userInput }, info) => {
			const { email, password } = userInput
			const user = await User.findOne({ email: email })
			if (!user) {
				const error = new Error('No user with that email')
				error.status = 409
				throw error
			}
			const isMatch = await user.isValidPassword(password)
			if (!isMatch) {
				const error = new Error('Unauthorized')
				error.status = 401
				throw error
			}
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
			const { email, password } = userInput
			const user = await User.findOne({ email: email })
			if (user) {
				// Throw error when account existed
				const error = new Error('Email exists already.')
				error.status = 409
				throw error
			}
			const newUser = await User.create(userInput)
			pubsub.publish('newUser', {
				newUser: newUser
			})
			return newUser
		},
		deleteMany: async () => {
			try {
				const rsUser = await User.deleteMany()
				return rsUser ? true : false
			} catch (error) {
				return e.message
			}
		}
	},
	User: {
		firstLetterOfEmail: parent => parent.email[0]
	}
}
