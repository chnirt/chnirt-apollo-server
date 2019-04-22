import { gql } from 'apollo-server-express';

export default gql`
	type Event {
		_id: ID!
		title: String!
		description: String!
		price: Float!
		date: String!
	}
	input EventInput {
		title: String
		description: String
		price: Float
		date: String
	}
	extend type Query {
		events: [Event!]!
		event(_id: ID!): Event
	}
	extend type Mutation {
		createEvent(eventInput: EventInput): Event
	}
`;
