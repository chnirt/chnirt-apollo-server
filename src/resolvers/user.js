import { User, Chat, Dainty } from '../models'
import { signUp, signIn, objectId } from '../schemas'
import Joi from 'joi'
import { tradeTokens, signOut } from '../auth/auth'

export default {
	Subscription: {
		newUser: {
			subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('newUser')
		}
	},
	Query: {
		me: async (root, args, context, info) => {
			// TODO: ensure login, projection
			// DONE:

			const { currentUser } = context

			return await currentUser
		},
		users: async (root, args, context, info) => {
			// TODO: projection, pagination
			// DONE:

			return await User.find()
		},
		user: async (root, args, context, info) => {
			// TODO: auth, projection, sanitization
			// DONE:

			await Joi.validate(args, objectId, { abortEarly: false })

			return await User.findById(args._id)
		}
	},
	Mutation: {
		register: async (root, { userInput }, { pubsub }, info) => {
			// TODO: ensure logout, validation
			// DONE:

			await Joi.validate(userInput, signUp, { abortEarly: false })

			const newUser = await User.create(userInput)

			pubsub.publish('newUser', {
				newUser: newUser
			})

			return true
		},
		login: async (root, { userInput }, { req }, info) => {
			// TODO: ensure logout, check session
			// DONE:

			await Joi.validate(userInput, signIn, { abortEarly: false })

			const { email, password } = userInput

			const { token } = await tradeTokens(email, password)

			return { token }
		},
		deleteMany: async () => {
			// TODO: delete all
			// DONE:
			const delUser = await User.deleteMany()
			const delChat = await Chat.deleteMany()
			const delDainty = await Dainty.deleteMany()
			return delUser && delChat && delDainty ? true : false
		}
	},
	User: {
		firstLetterOfEmail: root => root.email[0],
		chats: async (user, args, { req }, info) => {
			// TODO: should not be able to list other ppl's chats or read their msgs!
			return (await user.populate('chats').execPopulate()).chats
		},
		dainties: async (user, args, { req }, info) => {
			return (await user.populate('dainties').execPopulate()).dainties
		}
	}
}
