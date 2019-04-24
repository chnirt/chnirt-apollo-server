import { gql } from 'apollo-server-express'

export default gql`
	type Message {
		_id: ID!
		body: String!
		sender: User!
		chat: Chat!
		createdAt: String!
		updatedAt: String!
	}
`
