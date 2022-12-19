const { Router } = require('express');

const ToughtController = require('../controllers/ToughtController');
const { checkAuth } = require('../helpers/auth');
const router = Router();

router.get('/', ToughtController.showToughts);
router.get('/dashboard', checkAuth, ToughtController.dashboard);
router.get('/add', checkAuth, ToughtController.createTought);
router.post('/add', checkAuth, ToughtController.createToughtSave);
router.get('/edit/:id', checkAuth, ToughtController.editTought);
router.post('/edit', checkAuth, ToughtController.editToughtSave);
router.post('/remove', checkAuth, ToughtController.removeTought);

module.exports = router;
