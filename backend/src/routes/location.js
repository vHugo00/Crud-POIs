const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

router.get('/api/location', locationController.getAllLocations);
router.post('/api/location', locationController.createLocation);
router.get('/api/location/proximity', locationController.getNearbyLocations);
router.put('/api/location/:id', locationController.updateLocation);
router.delete('/api/location/:id', locationController.deleteLocation);

module.exports = router;
