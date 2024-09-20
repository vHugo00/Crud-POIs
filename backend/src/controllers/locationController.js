const { readLocations, writeLocations } = require('../services/locationService');
const { haversineDistance } = require('../utils/distanceUtil');

// Listar todos os locais
const getAllLocations = (req, res) => {
  const locations = readLocations();
  res.json(locations);
};

// Criar um novo local
const createLocation = (req, res) => {
  const locations = readLocations();
  const { name, latitude, longitude } = req.body;

  if (!name || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'Nome, latitude e longitude são obrigatórios' });
  }

  const newLocation = {
    id: locations.length > 0 ? locations[locations.length - 1].id + 1 : 1,
    name,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
  };

  locations.push(newLocation);
  writeLocations(locations);
  res.status(201).json(newLocation);
};

// Buscar por proximidade
const getNearbyLocations = (req, res) => {
  const { latitude, longitude, maxDistance } = req.query;
  if (!latitude || !longitude || !maxDistance) {
    return res.status(400).json({ error: 'Latitude, longitude e distância máxima são obrigatórios' });
  }

  const locations = readLocations();
  const nearbyLocations = locations.filter(location => 
    haversineDistance(parseFloat(latitude), parseFloat(longitude), location.latitude, location.longitude) <= parseFloat(maxDistance)
  );

  res.json(nearbyLocations);
};

// Atualizar local
const updateLocation = (req, res) => {
  const locations = readLocations();
  const { id } = req.params;
  const { name, latitude, longitude } = req.body;

  const locationIndex = locations.findIndex(loc => loc.id == id);
  
  if (locationIndex === -1) {
    return res.status(404).json({ error: 'Local não encontrado' });
  }

  if (!name || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'Nome, latitude e longitude são obrigatórios' });
  }

  locations[locationIndex] = { id: parseInt(id), name, latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
  writeLocations(locations);
  res.status(200).json(locations[locationIndex]);
};

// Deletar local
const deleteLocation = (req, res) => {
  const locations = readLocations();
  const { id } = req.params;

  const newLocations = locations.filter(loc => loc.id != id);

  if (newLocations.length === locations.length) {
    return res.status(404).json({ error: 'Local não encontrado' });
  }

  writeLocations(newLocations);
  res.status(200).json({ message: 'Local excluído com sucesso' });
};

module.exports = {
  getAllLocations,
  createLocation,
  getNearbyLocations,
  updateLocation,
  deleteLocation,
};
