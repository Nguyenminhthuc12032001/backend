const router = require('express').Router();
const { verifyToken, checkRole } = require('../middlewares/authentication.middlewares');
const adoptionListingController = require('../controllers/adoption_listing.controller');
const { validAdopt, validAdoptUpdate } = require('../middlewares/adoption.middleware');

router.post('/createNew', [verifyToken, checkRole(['shelter']), validAdopt], adoptionListingController.createNew);

router.get('/getAll', adoptionListingController.getAll);

router.get('/getAllMine', [verifyToken], adoptionListingController.getAll);

router.get('/get/:id', [verifyToken], adoptionListingController.get);

router.put('/update/:id', [verifyToken, checkRole(['shelter']), validAdoptUpdate], adoptionListingController.update);

router.post('/remove/:id', [verifyToken, checkRole(['shelter'])], adoptionListingController.remove);

router.get('/search', [verifyToken], adoptionListingController.search);

router.put('/requestAdoption/:id', [verifyToken], adoptionListingController.requestAdoption);

router.put('/confirmAdoption/:id', [verifyToken, checkRole(['shelter'])], adoptionListingController.confirmAdoption);

router.put('/rejectAdoption/:id', [verifyToken, checkRole(['shelter'])], adoptionListingController.rejectAdoption);

module.exports = router;
