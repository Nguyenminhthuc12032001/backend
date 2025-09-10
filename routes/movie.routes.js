const router = require('express').Router();
const movieController = require('../controllers/movie.controller');
const { validationMovie } = require('../middlewares/validdation.middlewares')
const uploadMovie = require('../middlewares/upload.middlewares')
const { verifyToken, checkRole } = require('../middlewares/authentication.middlewares');

router.post('/createNew', [verifyToken, checkRole('admin'), uploadMovie.single('posterURL'), validationMovie], movieController.createNew);
router.get('/getAll', movieController.getAll);
router.get('/getMovie/:id', movieController.getMovie);
router.put('/updateMovie/:id', [verifyToken, checkRole('admin'), uploadMovie.single('posterURL'), validationMovie], movieController.updateMovie);
router.delete('/deleteMovie/:id', [verifyToken, checkRole('admin')], movieController.deleteMovie);
router.get('/searchMovies', movieController.searchMovies);

module.exports = router;


