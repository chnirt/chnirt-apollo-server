import mongoose, { Schema } from 'mongoose'
import { User } from '../models'
const { ObjectId } = Schema.Types

const chatSchema = new Schema(
	{
		title: String,
		users: [
			{
				type: ObjectId,
				ref: 'User'
			}
		],
		lastMessage: {
			type: ObjectId,
			ref: 'Message'
		}
	},
	{
		timestamps: true
	}
)

const USER_LIMIT = 5

chatSchema.pre('save', async function(next) {
	try {
		if (!this.title) {
			const users = await User.where('_id')
				.in(this.users)
				.limit(USER_LIMIT)
				.select('username')
			let title = users.map(u => u.username).join(', ')

			if (this.users.length > USER_LIMIT) {
				title += '...'
			}
			this.title = title
		}
		next()
	} catch (error) {
		next(error)
	}
})

export default mongoose.model('Chat', chatSchema)
