import { User, Chat } from '../models'
import { signUp, signIn, objectId } from '../schemas'
import Joi from 'joi'
import { attemptSignIn, signOut } from '../auth/auth'

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
		users: async (parent, args, context, info) => {
			// TODO: projection, pagination
			// DONE:
			return await User.find()
		},
		user: async (parent, args, context, info) => {
			// TODO: auth, projection, sanitization
			// DONE:
			await Joi.validate(args, objectId, { abortEarly: false })
			return await User.findById(args._id)
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
				return await User.findById(userId)
			}

			await Joi.validate(userInput, signIn, { abortEarly: false })

			const { email, password } = userInput

			const user = await attemptSignIn(email, password)

			req.session.userId = user._id

			return user
		},
		logout: async (parent, args, { req, res }, info) => {
			// TODO: ensure login
			// DONE:
			return signOut(req, res)
		},
		deleteMany: async () => {
			// TODO: delete all
			// DONE:
			const delUser = await User.deleteMany()
			const delChat = await Chat.deleteMany()
			return delUser && delChat ? true : false
		}
	},
	User: {
		firstLetterOfEmail: parent => parent.email[0],
		chats: async (user, args, { req }, info) => {
			// TODO: should not be able to list other ppl's chats or read their msgs!
			return (await user.populate('chats').execPopulate()).chats
		}
	}
}
