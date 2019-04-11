const { gql } = require("apollo-server-express");

const typeDefs = gql`
  input UserInput {
    username: String
    email: String
  }
  type User {
    _id: ID!
    username: String
    email: String
  }
  type Query {
    getUsers: [User]
    getUser(_id: ID!): User
  }
  type Mutation {
    addUser(input: UserInput): User
  }
`;

module.exports = typeDefs;
