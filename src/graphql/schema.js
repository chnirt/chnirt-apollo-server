const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String
    email: String
  }
  input AddUserInput {
    username: String
    email: String
  }
  input EditUserInput {
    username: String
    email: String
  }
  type Query {
    getUsers: [User]
    getUser(_id: ID!): User
  }
  type Mutation {
    addUser(user: AddUserInput): User
    editUser(_id: ID!, user: EditUserInput): User
    deleteUser(_id: ID!): ID
  }
`;

module.exports = typeDefs;
