import http from 'http'
const { ApolloServer, PubSub } = require('apollo-server-express')
import express from 'express'

import 'dotenv/config'
import cors from 'cors'
const jwt = require('jsonwebtoken')

// const { ApolloEngine } = require('apollo-engine');
const { MemcachedCache } = require('apollo-server-cache-memcached')
import typeDefs from './typeDefs'
import resolvers from './resolvers'

import { express as voyagerMiddleware } from 'graphql-voyager/middleware'

const PORT = process.env.PORT || 5000
const ENV = process.env.NODE_ENV || 'production'
const In_PROD = ENV === 'production'
const path = '/graphql'
const voyagerPath = '/voyager'

const app = express()

// Connect Database
require('./config/database')

// Middleware
app.disable('x-powered-by')
app.use(cors())
app.use(voyagerPath, voyagerMiddleware({ endpointUrl: path }))

const pubsub = new PubSub()

const server = new ApolloServer({
	// These will be defined for both new or existing servers
	typeDefs,
	resolvers,
	context: ({ req, res }) => {
		return { req, res, pubsub }
	},
	subscriptions: {
		onConnect: (connectionParams, webSocket, context) => {
			console.log('🔗 Connected to websocket')
		}
	},
	persistedQueries: {
		cache: new MemcachedCache(
			['memcached-server-1', 'memcached-server-2', 'memcached-server-3'],
			{ retries: 10, retry: 10000 } // Options
		)
	},
	introspection: true,
	playground: !In_PROD && {
		settings: {
			'editor.cursorShape': 'line', // possible values: 'line', 'block', 'underline'
			'editor.fontFamily': `'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
			'editor.fontSize': 14,
			'editor.reuseHeaders': true, // new tab reuses headers from last tab
			'editor.theme': 'dark', // possible values: 'dark', 'light'
			'general.betaUpdates': false,
			'prettier.printWidth': 80,
			'prettier.tabWidth': 2,
			'prettier.useTabs': true,
			'request.credentials': 'omit', // possible values: 'omit', 'include', 'same-origin'
			'schema.polling.enable': true, // enables automatic schema polling
			'schema.polling.endpointFilter': '*localhost*', // endpoint filter for schema polling
			'schema.polling.interval': 2000, // schema polling interval in ms
			'schema.disableComments': false,
			'tracing.hideTracingResponse': true
		}
		// tabs: [
		//   {
		//     endpoint,
		//     query: defaultQuery
		//   }
		// ]
	},
	tracing: true,
	cacheControl: false,
	// We set `engine` to false, so that the new agent is not used.
	engine: false,
	/* Add this line to disable upload support! */
	uploads: false
})

// const engine = new ApolloEngine({
// 	apiKey: process.env.ENGINE_API_KEY
// });

//Mount a jwt or other authentication middleware that is run before the GraphQL execution
// app.use(path, jwtCheck);

server.applyMiddleware({ app, path }) // app is from an existing express app

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

httpServer.listen(PORT, () => {
	console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
	console.log(
		`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
	)
})

// engine.listen(
// 	{
// 		port: 4000,
// 		graphqlPaths: ['/api/graphql'],
// 		expressApp: app,
// 		launcherOptions: {
// 			startupTimeout: 3000
// 		}
// 	},
// 	() => {
// 		console.log('Listening!');
// 	}
// );
