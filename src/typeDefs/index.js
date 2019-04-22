import { gql } from 'apollo-server-express'

import root from './root'
import userSchema from './user'
import eventSchema from './event'
import bookingSchema from './booking'

const linkSchema = gql`
	type Query {
		_: Boolean
	}

	type Mutation {
		_: Boolean
	}

	type Subscription {
		_: Boolean
	}
`

export default [root, userSchema, eventSchema, bookingSchema]
