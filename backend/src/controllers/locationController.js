const { readLocations, writeLocations } = require('../services/locationService');

const getAllLocations = (req, res) => {
  const locations = readLocations();
  res.json(locations);
};

const getLocationById = (req, res) => {
  const { id } = req.params;
  const locations = readLocations();

  const location = locations.find(loc => loc.id === parseInt(id));
  if (!location) return res.status(404).json({ error: 'Local não encontrado.' });
  res.json(location);
};

const validateLocationData = (name, latitude, longitude) => {
  if (!name) {
    return 'Nome é obrigatório';
  }
  if (!latitude || isNaN(latitude) || latitude < 0 || !Number.isInteger(Number(latitude))) {
    return 'Latitude deve ser um número inteiro positivo';
  }
  if (!longitude || isNaN(longitude) || longitude < 0 || !Number.isInteger(Number(longitude))) {
    return 'Longitude deve ser um número inteiro positivo';
  }
  return null;
};

const createLocation = (req, res) => {
  const { name, latitude, longitude } = req.body;

  const validationError = validateLocationData(name, latitude, longitude);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const locations = readLocations();
  const newLocation = {
    id: locations.length > 0 ? locations[locations.length - 1].id + 1 : 1,
    name,
    latitude: parseInt(latitude),
    longitude: parseInt(longitude),
  };

  locations.push(newLocation);
  writeLocations(locations);
  res.status(201).json(newLocation);
};

const updateLocation = (req, res) => {
  const { id } = req.params;
  const { name, latitude, longitude } = req.body;

  const validationError = validateLocationData(name, latitude, longitude);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const locations = readLocations();
  const locationIndex = locations.findIndex(loc => loc.id === parseInt(id));

  if (locationIndex === -1) {
    return res.status(404).json({ error: 'Local não encontrado' });
  }

  locations[locationIndex] = {
    id: parseInt(id),
    name,
    latitude: parseInt(latitude),
    longitude: parseInt(longitude)
  };

  writeLocations(locations);
  res.status(200).json(locations[locationIndex]);
};

const deleteLocation = (req, res) => {
  const { id } = req.params;
  const locations = readLocations();

  const newLocations = locations.filter(loc => loc.id !== parseInt(id));
  if (newLocations.length === locations.length) {
    return res.status(404).json({ error: 'Local não encontrado' });
  }

  writeLocations(newLocations);
  res.status(200).json({ message: 'Local excluído com sucesso' });
};

module.exports = {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
};
