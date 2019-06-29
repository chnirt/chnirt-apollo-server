import http from 'http'
import { ApolloServer, PubSub } from 'apollo-server-express'
import express from 'express'
// import session from 'express-session'
// import connectRedis from 'connect-redis'
import { verifyTokens } from './auth/auth'

import 'dotenv/config'

// const { ApolloEngine } = require('apollo-engine');
import { MemcachedCache } from 'apollo-server-cache-memcached'
import typeDefs from './typeDefs'
import resolvers from './resolvers'
import schemaDirectives from './directives'

import { express as voyagerMiddleware } from 'graphql-voyager/middleware'

const PORT = process.env.PORT || 5000
const IN_PROD = (process.env.NODE_ENV || 'production') === 'production'
const path = '/graphql'
const voyagerPath = '/voyager'

// Connect Database
require('./config/database')

const app = express()

// Middleware
app.disable('x-powered-by')

// const RedisStore = connectRedis(session)

// const store = new RedisStore({
// 	host: process.env.REDIS_HOST,
// 	port: process.env.REDIS_PORT,
// 	pass: process.env.REDIS_PASSWORD
// })

// app.use(
// 	session({
// 		store,
// 		name: process.env.SESS_NAME,
// 		secret: process.env.SESS_SECRET,
// 		resave: true,
// 		rolling: true,
// 		saveUninitialized: false,
// 		cookie: {
// 			maxAge: parseInt(process.env.SESS_LIFETIME),
// 			sameSite: true,
// 			secure: IN_PROD
// 		}
// 	})
// )
app.use(voyagerPath, voyagerMiddleware({ endpointUrl: path }))

const pubsub = new PubSub()

const server = new ApolloServer({
	// These will be defined for both new or existing servers
	typeDefs,
	resolvers,
	schemaDirectives,
	context: async ({ req, res }) => {
		let currentUser = ''

		const { token } = req.headers

		if (token) {
			currentUser = await verifyTokens(token)
		}

		// add the user to the context
		return {
			req,
			res,
			pubsub,
			currentUser
		}
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
	playground: !IN_PROD && {
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
			'request.credentials': 'include', // possible values: 'omit', 'include', 'same-origin'
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

// enable cors
var corsOptions = {
	// origin: 'http://localhost:3000',
	credentials: true // <-- REQUIRED backend setting
}

server.applyMiddleware({
	app,
	path,
	cors: corsOptions
}) // app is from an existing express app

const httpServer = http.createServer(app)

// Add subscription support
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
