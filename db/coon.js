const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('toughts', 'root', 'ZjLeMo8b7G9HKltd6yoI', {
	host: 'containers-us-west-166.railway.app',
	dialect: 'mysql',
	port: '6732',
});
try {
	sequelize.authenticate();
	console.log('conectado');
} catch (err) {
	console.log('erro', err);
}

module.exports = sequelize;
