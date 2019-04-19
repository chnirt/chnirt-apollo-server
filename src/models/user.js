const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	createdEvents: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Event'
		}
	],
	todos: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Todo'
		}
	]
});

userSchema.pre('save', async function(next) {
	try {
		const user = this;
		// Generate a password hash (salt + hash)
		const hash = await bcrypt.hash(this.password, 10);
		this.password = hash;
		next();
	} catch (error) {
		next(error);
	}
});

module.exports = mongoose.model('User', userSchema);
