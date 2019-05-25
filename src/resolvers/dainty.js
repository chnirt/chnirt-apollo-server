import { Dainty } from '../models'
import { createDainty } from '../schemas'
import Joi from 'joi'
import { User } from '../models'

export default {
	Query: {
		dainties: async (root, args, context, info) => {
			// TODO: projection, pagination
			// DONE:

			return await Dainty.find()
		}
	},
	Mutation: {
		createDainty: async (root, { daintyInput }, context, info) => {
			// TODO: ensure login, validation
			// DONE:
			const { currentUser } = context

			await Joi.validate(daintyInput, createDainty, { abortEarly: false })

			const newDainty = await Dainty.create({
				...daintyInput,
				sender: currentUser._id
			})

			await User.updateOne(
				{ _id: currentUser._id },
				{
					$push: { dainties: newDainty }
				}
			)

			return true
		}
	}
}
