import Booking from '../models/booking'
import booking from '../schema/booking'

export default {
	Query: {
		bookings: async () => await Booking.find()
	}
}
