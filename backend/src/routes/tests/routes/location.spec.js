const request = require('supertest');
const express = require('express');
const locationRoutes = require('../../location.js');

const app = express();
app.use(express.json());
app.use(locationRoutes);

const mockLocations = [
  { id: 1, name: 'Localização 1', latitude: 10, longitude: 20 },
  { id: 2, name: 'Localização 2', latitude: 30, longitude: 40 },
];

jest.mock('../../../controllers/locationController', () => ({
  getAllLocations: jest.fn((req, res) => res.json(mockLocations)),
  getLocationById: jest.fn((req, res) => {
    const location = mockLocations.find(loc => loc.id === parseInt(req.params.id));
    if (location) {
      return res.json(location);
    }
    return res.status(404).json({ error: 'Local não encontrado' });
  }),
  createLocation: jest.fn((req, res) => {
    const newLocation = { id: mockLocations.length + 1, ...req.body };
    mockLocations.push(newLocation);
    return res.status(201).json(newLocation);
  }),
  updateLocation: jest.fn((req, res) => {
    const index = mockLocations.findIndex(loc => loc.id === parseInt(req.params.id));
    if (index >= 0) {
      const updatedLocation = { ...mockLocations[index], ...req.body };
      mockLocations[index] = updatedLocation;
      return res.json(updatedLocation);
    }
    return res.status(404).json({ error: 'Local não encontrado' });
  }),
  deleteLocation: jest.fn((req, res) => {
    const index = mockLocations.findIndex(loc => loc.id === parseInt(req.params.id));
    if (index >= 0) {
      mockLocations.splice(index, 1);
      return res.status(204).json();
    }
    return res.status(404).json({ error: 'Local não encontrado' });
  }),
}));

describe('API de Localização', () => {
  it('buscar todas as localizações', async () => {
    const response = await request(app).get('/api/location');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockLocations);
  });

  it('buscar uma localização pelo id', async () => {
    const response = await request(app).get('/api/location/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockLocations[0]);
  });

  it('criar uma nova localização', async () => {
    const newLocation = { name: 'Nova Localização', latitude: 15, longitude: 25 };
    const response = await request(app).post('/api/location').send(newLocation);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(newLocation.name);
  });

  it('atualizar uma localização pelo id', async () => {
    const updatedLocation = { name: 'Localização Atualizada', latitude: 15, longitude: 25 };
    const response = await request(app).put('/api/location/1').send(updatedLocation);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedLocation.name);
  });

  it('deletar uma localização pelo id', async () => {
    const response = await request(app).delete('/api/location/1');
    expect(response.status).toBe(204);
  });
});
