import { gql } from 'apollo-server-express'

export default gql`
	type AuthData {
		userId: ID!
		token: String!
		tokenExpiration: String!
	}
	type User {
		_id: ID!
		email: String!
		password: String!
		firstLetterOfEmail: String!
		createdAt: String!
		updatedAt: String!
	}
	input UserInput {
		email: String!
		password: String!
	}
	input EditUserInput {
		email: String!
		password: String!
	}
	extend type Query {
		me: User
		users: [User]
		user(_id: ID!): User
	}

	extend type Mutation {
		login(userInput: UserInput!): AuthData
		register(userInput: UserInput!): User
		deleteMany: Boolean
	}

	extend type Subscription {
		newUser: User!
	}
`
