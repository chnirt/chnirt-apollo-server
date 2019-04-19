const User = require('../models/user');
const Todo = require('../models/todo');
const Event = require('../models/event');

export default {
	Subscription: {
		newUser: {
			subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('newUser')
		}
	},
	User: {
		firstLetterOfEmail: parent => {
			console.log(parent);
			return parent.email[0];
		}
	},
	Query: {
		getUsers: async () => await User.find(),
		getUser: async (_, { _id }) => {
			return await User.findOne({ _id: _id });
		}
	},
	Mutation: {
		login: async (parent, { userInput }, { pubsub }) => {
			try {
				//checkPassword
				//awaitcheckPassword(password);
				const { email, password } = userInput;
				pubsub.publish('newUser', {
					newUser: userInput
				});
				return await userInput;
			} catch (error) {
				return error.message;
			}
		},
		createUser: async (_, { userInput }) => {
			try {
				console.log(userInput);
				return await User.create(userInput);
			} catch (e) {
				return e.message;
			}
		},
		editUser: async (_, { _id, user }) => {
			try {
				return await User.updateOne(
					{ _id: _id },
					{
						$set: user
					},
					{ new: true }
				);
			} catch (error) {
				return e.message;
			}
		},
		deleteUser: async (_, { _id }) => {
			try {
				return (await User.deleteOne({ _id })) ? _id : null;
			} catch (e) {
				return e.message;
			}
		},
		deleteMany: async () => {
			try {
				const rsUser = await User.deleteMany();
				const rsTodo = await Todo.deleteMany();
				const rsEvent = await Event.deleteMany();
				return rsUser && rsTodo ? true : false;
			} catch (error) {
				return e.message;
			}
		}
	}
};
