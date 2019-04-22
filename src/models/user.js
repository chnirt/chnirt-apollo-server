const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			validate: {
				validator: email => User.doestntExist({ email }),
				message: ({ value }) => `Email ${value} has already been taken.`
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
		createdEvents: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Event'
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

userSchema.methods.matchesPassword = async function(newPassword) {
	try {
		const user = this
		return await bcrypt.compare(newPassword, user.password)
	} catch (error) {
		throw new Error(error)
	}
}

const User = mongoose.model('User', userSchema)

export default User
