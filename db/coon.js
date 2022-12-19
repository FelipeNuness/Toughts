const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
	'toughts',
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		dialect: 'mysql',
		port: process.env.DB_PORT,
	},
);
try {
	sequelize.authenticate();
	console.log('conectado');
} catch (err) {
	console.log('erro', err);
}

module.exports = sequelize;
