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
		username: String!
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
	extend type Query {
		me: User
		users: [User]
		user(_id: ID!): User
	}

	extend type Mutation {
		login(userInput: LoginUserInput!): AuthData
		register(userInput: UserInput!): User
		logout: Boolean
		deleteMany: Boolean
	}

	extend type Subscription {
		newUser: User!
	}
`
