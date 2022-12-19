const bcrypt = require('bcryptjs');

const User = require('../models/User');

module.exports = class AuthController {
	static login(req, res) {
		res.render('auth/login');
	}
	static async loginPost(req, res) {
		const { email, password } = req.body;
		const user = await User.findOne({ where: { email } });
		const passwordMatch = bcrypt.compareSync(password, user.password);
		if (!user || !passwordMatch) {
			req.flash('message', 'E-mail e/ou senha inválido');
			res.render('auth/login');
			return;
		}

		req.session.userid = user.id;

		req.flash('message', 'Login realizado com sucesso!');

		req.session.save(() => {
			res.redirect('/');
		});
	}
	static register(req, res) {
		res.render('auth/register');
	}
	static async registerPost(req, res) {
		const { name, email, password, confirmpassword } = req.body;

		if (password != confirmpassword) {
			req.flash('message', 'As senhas não conferem, tente novamente!');
			res.render('auth/register');
			return;
		}

		const checkEmail = await User.findOne({ where: { email } });
		if (checkEmail) {
			req.flash('message', 'E-mail já está em uso!');
			res.render('auth/register');
			return;
		}
		const checkUsername = await User.findOne({ where: { name } });
		if (checkUsername) {
			req.flash('message', 'Nome de usuário já está em uso!');
			res.render('auth/register');
			return;
		}
		// cript passoword
		const salt = bcrypt.genSaltSync(10);

		const hasedPassword = bcrypt.hashSync(password, salt);

		const user = {
			name,
			email,
			password: hasedPassword,
		};
		try {
			const createdUser = await User.create(user);
			//auth - initialize session

			req.session.userid = createdUser.id;

			req.flash('message', 'Cadastro realizado com sucesso!');

			req.session.save(() => {
				res.redirect('/');
			});
		} catch (err) {
			console.log(err);
		}
	}
	static logout(req, res) {
		req.session.destroy();
		res.redirect('/login');
	}
};
