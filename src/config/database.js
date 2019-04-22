const mongoose = require('mongoose')
// mongoose.Promise = global.Promise;

const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${
	process.env.MONGO_HOST
}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`

mongoose.connect(url, {
	useNewUrlParser: true,
	useFindAndModify: false,
	useCreateIndex: true
})

mongoose.connection.once('open', () => console.log(`☁️ Database connected`))
