const { readLocations, writeLocations } = require('../services/locationService');

// Listar todos os locais
const getAllLocations = (req, res) => {
  const locations = readLocations();
  res.json(locations);
};

const getLocationById = (req, res) => {
  const { id } = req.params;
  const locations = readLocations();

  const location = locations.find(loc => loc.id === parseInt(id));
  if (!location) return res.status(404).send('Local não encontrado.');
  res.json(location);
};

// Criar um novo local
const createLocation = (req, res) => {
  const locations = readLocations();
  const { name, latitude, longitude } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }
  if (!latitude) {
    return res.status(400).json({ error: 'Latitude é obrigatória' });
  }
  if (!longitude) {
    return res.status(400).json({ error: 'Longitude é obrigatória' });
  }

  const lat = parseFloat(latitude);
  const long = parseFloat(longitude);

  if (lat < 0) {
    return res.status(400).json({ error: 'Latitude deve ser um número positivo' });
  }
  if (long < 0) {
    return res.status(400).json({ error: 'Longitude deve ser um número positivo' });
  }

  const newLocation = {
    id: locations.length > 0 ? locations[locations.length - 1].id + 1 : 1,
    name,
    latitude: lat,
    longitude: long,
  };

  locations.push(newLocation);
  writeLocations(locations);
  res.status(201).json(newLocation);
};

// Atualizar local
const updateLocation = (req, res) => {
  const locations = readLocations();
  const { id } = req.params;
  const { name, latitude, longitude } = req.body;

  const locationIndex = locations.findIndex(loc => loc.id === parseInt(id, 10));

  if (locationIndex === -1) {
    return res.status(404).json({ error: 'Local não encontrado' });
  }
  if (!name) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }
  if (!latitude) {
    return res.status(400).json({ error: 'Latitude é obrigatória' });
  }
  if (!longitude) {
    return res.status(400).json({ error: 'Longitude é obrigatória' });
  }

  const lat = parseFloat(latitude);
  const long = parseFloat(longitude);

  if (isNaN(lat) || isNaN(long)) {
    return res.status(400).json({ error: 'Latitude e longitude devem ser números válidos' });
  }
  if (lat < 0) {
    return res.status(400).json({ error: 'Latitude deve ser um número positivo' });
  }
  if (long < 0) {
    return res.status(400).json({ error: 'Longitude deve ser um número positivo' });
  }

  locations[locationIndex] = {
    id: parseInt(id),
    name,
    latitude: lat,
    longitude: long
  };

  writeLocations(locations);
  res.status(200).json(locations[locationIndex]);
};

// Deletar local
const deleteLocation = (req, res) => {
  const locations = readLocations();
  const { id } = req.params;

  const newLocations = locations.filter(loc => loc.id !== parseInt(id));

  if (newLocations.length === locations.length) {
    return res.status(404).json({ error: 'Local não encontrado' });
  }

  writeLocations(newLocations);
  res.status(200).json({ message: 'Local excluído com sucesso' });
};

// Buscar por proximidade
const getNearbyLocations = (req, res) => {
  const { latitude, longitude, maxDistance } = req.query;

  if (!latitude || !longitude || !maxDistance) {
    return res.status(400).json({ error: 'Latitude, longitude e distância máxima são obrigatórios' });
  }

  const lat = parseFloat(latitude);
  const long = parseFloat(longitude);
  const maxDist = parseFloat(maxDistance);

  const locations = readLocations(); // Função que lê os locais disponíveis
  const nearbyLocations = locations.filter(location => {
    const distance = calculateDistance(lat, long, location.latitude, location.longitude);
    return distance <= maxDist;
  });

  if (nearbyLocations.length === 0) {
    return res.status(404).json({ message: 'Nenhum local encontrado próximo a estas coordenadas.' });
  }

  res.json(nearbyLocations);
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distância em km
};


module.exports = {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  getNearbyLocations,
};
