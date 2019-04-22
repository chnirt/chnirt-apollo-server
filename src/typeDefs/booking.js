import { gql } from 'apollo-server-express'

export default gql`
	type Booking {
		_id: ID!
		event: Event!
		user: User!
		createdAt: String!
		updatedAt: String!
	}
`
