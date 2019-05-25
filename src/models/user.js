import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			validate: {
				validator: email => User.doestntExist({ email }),
				message: () => `Email has already been taken.`
			}
		},
		password: {
			type: String,
			required: true
		},
		username: {
			type: String,
			required: true
		},
		dainties: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Dainty'
			}
		],
		chats: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Chat'
			}
		]
	},
	{
		timestamps: true
	}
)

userSchema.statics.doestntExist = async function(options) {
	return (await this.where(options).countDocuments()) === 0
}

userSchema.pre('save', async function(next) {
	try {
		const user = this
		// Generate a password hash (salt + hash)
		const hash = await bcrypt.hash(user.password, 10)
		user.password = hash
		next()
	} catch (error) {
		next(error)
	}
})

userSchema.methods.matchesPassword = async function(password) {
	return await bcrypt.compare(password, this.password)
}

userSchema.pre('findOneAndUpdate', async function(next) {
	try {
		const _id = this.getQuery()._id
		const user = this._update.$set
		// Generate a password hash (salt + hash)
		const hash = await bcrypt.hash(user.password, 10)
		user.password = hash
		next()
	} catch (error) {
		next(error)
	}
})

const User = mongoose.model('User', userSchema)

export default User
