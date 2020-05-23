const { mongooseConnection } = require('../database/mongoose');

module.exports = {
	run: () => {
		console.log('The bot has started');
		mongooseConnection();
	}
}