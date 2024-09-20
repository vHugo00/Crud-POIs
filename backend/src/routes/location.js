const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const filePath = path.join(__dirname, '../../data/locations.json');

// Função para ler o arquivo JSON
const readLocations = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler o arquivo JSON:', error);
    return [];
  }
};

// Função para escrever no arquivo JSON
const writeLocations = (locations) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(locations, null, 2));
  } catch (error) {
    console.error('Erro ao escrever no arquivo JSON:', error);
  }
};

// Rota para listar todos os locais
router.get('/api/location', (req, res) => {
  const locations = readLocations();
  res.json(locations);
});

// Rota para criar um novo local
router.post('/api/location', (req, res) => {
  const locations = readLocations();
  const { name, latitude, longitude } = req.body;
  
  if (!name || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'Nome, latitude e longitude são obrigatórios' });
  }

  const newLocation = {
    id: locations.length > 0 ? locations[locations.length - 1].id + 1 : 1,
    name,
    latitude,
    longitude
  };

  locations.push(newLocation);
  writeLocations(locations);
  res.status(201).json(newLocation);
});

// Rota para buscar locais por proximidade (usando Haversine formula)
router.get('/api/location/proximity', (req, res) => {
  const { latitude, longitude, maxDistance } = req.query;
  if (!latitude || !longitude || !maxDistance) {
    return res.status(400).json({ error: 'Latitude, longitude e distância máxima são obrigatórios' });
  }

  const locations = readLocations();
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  const maxDist = parseFloat(maxDistance);

  const toRadians = (degrees) => degrees * (Math.PI / 180);

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // raio da Terra em metros
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const nearbyLocations = locations.filter(location => 
    haversineDistance(lat, lon, location.latitude, location.longitude) <= maxDist
  );

  res.json(nearbyLocations);
});

// Rota para atualizar um local existente
router.put('/api/location/:id', (req, res) => {
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

  locations[locationIndex] = { id: parseInt(id), name, latitude, longitude };
  writeLocations(locations);
  res.status(200).json(locations[locationIndex]);
});

// Rota para deletar um local
router.delete('/api/location/:id', (req, res) => {
  const locations = readLocations();
  const { id } = req.params;

  const newLocations = locations.filter(loc => loc.id != id);

  if (newLocations.length === locations.length) {
    return res.status(404).json({ error: 'Local não encontrado' });
  }

  writeLocations(newLocations);
  res.status(200).json({ message: 'Local excluído com sucesso' });
});

module.exports = router;
