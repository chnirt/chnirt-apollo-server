import { Dainty } from '../models'
import { createDainty, objectId } from '../schemas'
import Joi from 'joi'
import { User } from '../models'

export default {
	Query: {
		dainties: async (root, args, context, info) => {
			// TODO: projection, pagination
			// DONE:

			return await Dainty.find()
		},
		dainty: async (root, args, context, info) => {
			return await Dainty.findById(args._id)
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
		},
		updateDainty: async (root, { _id, daintyInput }, context, info) => {
			// TODO: ensure login, validation
			// DONE:
			await Joi.validate({ _id }, objectId, { abortEarly: false })

			await Joi.validate(daintyInput, createDainty, {
				abortEarly: false
			})

			await Dainty.findOneAndUpdate({ _id }, daintyInput, { new: true })

			return true
		},
		deleteDainty: async (root, args, context, info) => {
			// TODO: ensure login, validation
			// DONE:
			await Joi.validate(args, objectId, {
				abortEarly: false
			})

			await Dainty.findOneAndRemove({
				_id: args._id
			})

			return true
		}
	}
}
