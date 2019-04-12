import express from "express";
import "dotenv/config";
import cors from "cors";
const { ApolloServer } = require("apollo-server-express");
import typeDefs from "./schema";
import resolvers from "./resolvers";

import { express as voyagerMiddleware } from "graphql-voyager/middleware";

const port = process.env.PORT || 4000;
const path = "/graphql";

const app = express();

// Connect Database
require("./config/database");

//Middleware
app.use(cors());
app.use("/voyager", voyagerMiddleware({ endpointUrl: path }));

const server = new ApolloServer({
  // These will be defined for both new or existing servers
  typeDefs,
  resolvers,
  playground: {
    settings: {
      "editor.cursorShape": "line", // possible values: 'line', 'block', 'underline'
      "editor.fontFamily": `'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
      "editor.fontSize": 14,
      "editor.reuseHeaders": true, // new tab reuses headers from last tab
      "editor.theme": "dark", // possible values: 'dark', 'light'
      "general.betaUpdates": false,
      "prettier.printWidth": 80,
      "prettier.tabWidth": 2,
      "prettier.useTabs": true,
      "request.credentials": "omit", // possible values: 'omit', 'include', 'same-origin'
      "schema.polling.enable": true, // enables automatic schema polling
      "schema.polling.endpointFilter": "*localhost*", // endpoint filter for schema polling
      "schema.polling.interval": 2000, // schema polling interval in ms
      "schema.disableComments": false,
      "tracing.hideTracingResponse": true
    }
    // tabs: [
    //   {
    //     endpoint,
    //     query: defaultQuery
    //   }
    // ]
  },
  tracing: true,
  cacheControl: true,
  // We set `engine` to false, so that the new agent is not used.
  engine: false,
  /* Add this line to disable upload support! */
  uploads: false
});

//Mount a jwt or other authentication middleware that is run before the GraphQL execution
// app.use(path, jwtCheck);

server.applyMiddleware({ app, path }); // app is from an existing express app

app.listen(port, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
