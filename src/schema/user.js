import { gql } from 'apollo-server-express';

export default gql`
	type User {
		_id: ID!
		email: String!
		firstLetterOfEmail: String!
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
		getUsers: [User]
		getUser(_id: ID!): User
	}

	extend type Mutation {
		login(userInput: UserInput!): User
		createUser(userInput: UserInput): User
		editUser(_id: ID!, user: EditUserInput): User
		deleteUser(_id: ID!): ID
		deleteMany: Boolean
	}

	extend type Subscription {
		newUser: User!
	}
`;
