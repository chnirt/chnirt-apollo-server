import { gql } from 'apollo-server-express'

export default gql`
	extend type Query {
		me: User @auth
		users: [User!]! @auth
		user(_id: ID!): User @auth
	}
	extend type Mutation {
		register(userInput: UserInput!): Boolean
		login(userInput: LoginUserInput!): Token
		deleteMany: Boolean
	}
	extend type Subscription {
		newUser: User!
	}
	type Token {
		token: String!
	}
	type User {
		_id: ID!
		email: String!
		password: String!
		username: String!
		dainties: [Dainty!]!
		chats: [Chat!]!
		firstLetterOfEmail: String!
		createdAt: String!
		updatedAt: String!
	}
	input UserInput {
		email: String!
		password: String!
		username: String!
	}
	input LoginUserInput {
		email: String!
		password: String!
	}
`
