const router = require('express').Router();
const { verifyToken, checkRole } = require('../middlewares/authentication.middlewares');
const adoptionListingController = require('../controllers/adoption_listing.controller')

router.post('/createNew', [verifyToken, checkRole('shelter')], adoptionListingController.createNew);

router.get('/getAll', [verifyToken], adoptionListingController.getAll);

router.get('/get/:id', [verifyToken], adoptionListingController.get);

router.put('/update/:id', [verifyToken, checkRole('shelter')], adoptionListingController.update);

router.post('/remove/:id', [verifyToken, checkRole('shelter')], adoptionListingController.remove);

router.get('/search', [verifyToken], adoptionListingController.search);

router.put('/requestAdoption/:id', [verifyToken], adoptionListingController.requestAdoption);

router.put('/confirmAdoption/:id', [verifyToken, checkRole('shelter')], adoptionListingController.confirmAdoption);

router.put('/rejectAdoption/:id', [verifyToken, checkRole('shelter')], adoptionListingController.rejectAdoption);

module.exports = router;
