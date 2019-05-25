import { gql } from 'apollo-server-express'

export default gql`
	extend type Query {
		dainties: [Dainty!]! @auth
	}
	extend type Mutation {
		createDainty(daintyInput: DaintyInput!): Boolean @auth
	}
	type Dainty {
		_id: ID!
		imageUrl: String!
		name: String!
		quantity: Int!
		sender: User!
		createdAt: String!
		updatedAt: String!
	}
	input DaintyInput {
		imageUrl: String!
		name: String!
		quantity: Int!
	}
`
