// modulos externos
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');
// modulos internos

const conn = require('./db/coon');

//models
const Tought = require('./models/Tought');
const User = require('./models/User');

// rotas
const toughtsRoutes = require('./routes/toughtsRoutes');
const authRoutes = require('./routes/authRoutes');

//controllers
const ToughtController = require('./controllers/ToughtController');

const app = express();

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(
	session({
		name: 'session',
		secret: 'nosso_secret',
		resave: false,
		saveUninitialized: false,
		store: new FileStore({
			logFn: function () {},
			path: require('path').join(require('os').tmpdir(), 'sessions'),
		}),
		cookie: {
			secure: false,
			maxAge: 360000,
			expires: new Date(Date.now() + 360000),
			httpOnly: true,
		},
	}),
);
app.use(flash());
app.use((req, res, next) => {
	if (req.session.userid) {
		res.locals.session = req.session;
	}
	next();
});
app.use('/toughts', toughtsRoutes);
app.use('/', authRoutes);

app.get('/', ToughtController.showToughts);

conn
	.sync({ force: true })
	.then(() => {
		app.listen(process.env.PORT, () => {
			console.log(`Server Listen to${process.env.PORT}`);
		});
	})
	.catch((err) => console.log(err));
