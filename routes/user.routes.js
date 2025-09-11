const router = require('express').Router();
const { verifyToken, checkRole } = require('../middlewares/authentication.middlewares');
const userController = require('../controllers/user.controller');
const { validUser, validUserUpdate } = require('../middlewares/validUser.middlewares');

router.post('/createNew', [verifyToken, checkRole('admin'), validUser], userController.createNew);
router.get('/getAll', [verifyToken, checkRole('admin')], userController.getAll);
router.get('/get/:id', [verifyToken, checkRole('admin')], userController.get);
router.put('/update/:id', [verifyToken, checkRole('admin'), validUserUpdate], userController.update);
router.post('/remove/:id', [verifyToken, checkRole('admin')], userController.remove);
router.get('/search', [verifyToken, checkRole('admin')], userController.search);
router.post('/login', [validUserUpdate], userController.login);
router.put('/resetPassword/:id', userController.resetPassword);
router.get('/verifyEmail', userController.verifyEmail);
router.post('/resetPasswordRequest', userController.resetPasswordRequest);

module.exports = router;