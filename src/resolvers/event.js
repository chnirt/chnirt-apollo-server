const Event = require('../models/event')

export default {
	Query: {
		events: async () =>
			await Event.find()
				.then(events => {
					return events.map(event => {
						return { ...event._doc }
					})
				})
				.catch(err => {
					console.log(err)
					throw err
				})
	},
	Mutation: {
		createEvent: async (_, { eventInput }) => {
			const event = new Event({
				title: eventInput.title,
				description: eventInput.description,
				price: eventInput.price,
				date: eventInput.date,
				creator: eventInput.creator
			})

			return await event.create()
			console.log(event)
			// return await event
			// 	.save()
			// 	.then(res => {
			// 		// console.log(res);
			// 		return { ...res._doc }
			// 	})
			// 	.catch(err => {
			// 		// console.log(err);
			// 		throw err
			// 	})
		}
	}
}
