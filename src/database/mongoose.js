const { connect, connection } = require('mongoose');

const mongooseConnection = () => {
	connect(process.env.MONGOOSE_URL, { 
		useNewUrlParser: true, 
		useUnifiedTopology: true 
	});

	connection.on('error', (e) => console.error(e));
	connection.on('open', () => console.log('Connected to mongoDB with sucess!'));
}

module.exports = { mongooseConnection };