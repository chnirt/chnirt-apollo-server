import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getTodos: [Todo]
    getTodo(_id: ID!): Todo
  }

  extend type Mutation {
    addTodo(userId: ID!, todo: AddTodoInput): Todo
    editTodo(_id: ID!, todo: EditTodoInput): Todo
    deleteTodo(_id: ID!): ID
  }

  type Todo {
    _id: ID!
    title: String
    creater: User!
    isDisable: Boolean
  }
  input AddTodoInput {
    title: String
  }
  input EditTodoInput {
    title: String
  }
`;
