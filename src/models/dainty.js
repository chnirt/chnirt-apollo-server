import mongoose, { Schema } from 'mongoose'

const daintySchema = new Schema(
	{
		imageUrl: String,
		name: String,
		quantity: Number,
		sender: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	},
	{
		timestamps: true
	}
)

export default mongoose.model('Dainty', daintySchema)
