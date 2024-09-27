const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

router.get('/api/location', locationController.getAllLocations);
router.get('/api/location/:id', locationController.getLocationById);
router.post('/api/location', locationController.createLocation);
router.put('/api/location/:id', locationController.updateLocation);
router.delete('/api/location/:id', locationController.deleteLocation);

module.exports = router;