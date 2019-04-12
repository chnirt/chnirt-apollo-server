import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getUsers: [User]
    getUser(_id: ID!): User
  }

  extend type Mutation {
    addUser(user: AddUserInput): User
    editUser(_id: ID!, user: EditUserInput): User
    deleteUser(_id: ID!): ID
    deleteMany: Boolean
  }

  type User {
    _id: ID!
    username: String
    email: String
    password: String
    todos: [Todo]
  }
  input AddUserInput {
    username: String
    email: String
    password: String
  }
  input EditUserInput {
    username: String
    email: String
    password: String
  }
`;
