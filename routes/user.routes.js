const router = require('express').Router();
const { verifyToken, checkRole } = require('../middlewares/authentication.middlewares');
const adminController = require('../controllers/user.controller');
const { validUser, validUserUpdate } = require('../middlewares/validUser.middlewares');

router.post('/createNew', [verifyToken, checkRole('admin'), validUser], adminController.createNew);
router.get('/getAll', [verifyToken, checkRole('admin')], adminController.getAll);
router.get('/get/:id', [verifyToken, checkRole('admin')], adminController.get);
router.put('/update/:id', [verifyToken, checkRole('admin'), validUserUpdate], adminController.update);
router.post('/remove/:id', [verifyToken, checkRole('admin')], adminController.remove);
router.get('/search', [verifyToken, checkRole('admin')], adminController.search);
router.post('/login', [validUserUpdate], adminController.login);

module.exports = router;