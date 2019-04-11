import express from "express";
import "dotenv/config";
// const logger = require("morgan");
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./graphql";

const app = express();

require("./config/database");

const port = process.env.PORT || 4000;
const server = new ApolloServer({
  // These will be defined for both new or existing servers
  typeDefs,
  resolvers
});

server.applyMiddleware({ app }); // app is from an existing express app

app.listen(port, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
