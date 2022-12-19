const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
	'toughts',
	process.env.USER,
	process.env.PASSWORD,
	{
		host: process.env.HOST,
		dialect: 'mysql',
		port: process.env.PORT,
	},
);
try {
	sequelize.authenticate();
	console.log('conectado');
} catch (err) {
	console.log('erro', err);
}

module.exports = sequelize;
