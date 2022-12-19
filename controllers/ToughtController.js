const Tought = require('../models/Tought');
const User = require('../models/User');
const { Op } = require('sequelize');

module.exports = class ToughtController {
	static async showToughts(req, res) {
		let search = '';
		let order = 'DESC';

		if (req.query.search) {
			search = req.query.search;
		}
		if (req.query.order === 'old') {
			order = 'ASC';
		}

		const toughtsData = await Tought.findAll({
			include: User,
			where: {
				title: { [Op.like]: `%${search}%` },
			},
			order: [['createdAt', order]],
		});
		const toughts = toughtsData.map((item) => item.get({ plain: true }));

		let toughtQty = toughts.length;
		if (toughtQty === 0) {
			toughtQty = false;
		}

		res.render('toughts/home', { toughts, search, toughtQty });
	}
	static async dashboard(req, res) {
		const userId = req.session.userid;
		const user = await User.findOne({
			where: { id: userId },
			include: Tought,
			plain: true,
		});
		if (!user) {
			res.redirect('/login');
		}

		const toughts = user.Toughts.map((item) => item.dataValues);

		let emptyToughts = false;

		if (toughts.length === 0) {
			emptyToughts = true;
		}

		res.render('toughts/dashboard', { toughts, emptyToughts });
	}
	static createTought(req, res) {
		res.render('toughts/create');
	}
	static async createToughtSave(req, res) {
		const tought = {
			title: req.body.title,
			UserId: req.session.userid,
		};

		try {
			await Tought.create(tought);
			req.flash('message', 'Pensamento criado com sucesso!');
			req.session.save(() => {
				res.redirect('/toughts/dashboard');
			});
		} catch (err) {
			console.log(`Aconteceu um erro: ${err}`);
		}
	}

	static async editTought(req, res) {
		const id = req.params.id;

		const tought = await Tought.findOne({
			where: { id },
			raw: true,
			include: User,
		});

		console.log(tought.UserId, req.session.userid);
		if (tought.UserId != req.session.userid) {
			res.redirect('/toughts/dashboard');
			return;
		}

		res.render('toughts/edit', { tought });
	}

	static async editToughtSave(req, res) {
		const { id, title } = req.body;

		try {
			await Tought.update({ title }, { where: { id } });
			req.flash('message', 'Pensamento editado com sucesso!');
			req.session.save(() => {
				res.redirect('/toughts/dashboard');
			});
		} catch (err) {
			console.log(`Ocorreu um erro ${err}`);
		}
	}

	static async removeTought(req, res) {
		const id = req.body.id;
		const UserId = req.session.userid;
		try {
			await Tought.destroy({ where: { id, UserId } });

			req.flash('message', 'Pensamento removido com sucesso!');
			req.session.save(() => {
				res.redirect('/toughts/dashboard');
			});
		} catch (err) {
			console.log(`Ocorreu um erro: ${err}`);
		}
	}
};
