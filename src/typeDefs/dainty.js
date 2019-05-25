import { gql } from 'apollo-server-express'

export default gql`
	extend type Query {
		dainties: [Dainty!]! @auth
		dainty(_id: ID!): Dainty! @auth
	}
	extend type Mutation {
		createDainty(daintyInput: DaintyInput!): Boolean @auth
		updateDainty(_id: ID!, daintyInput: DaintyInput!): Boolean @auth
		deleteDainty(_id: ID!): Boolean @auth
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
