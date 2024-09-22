// src/routes/tests/routes/location.spec.js

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

// Mock para a função que lê as localizações
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
  getNearbyLocations: jest.fn((req, res) => res.json(mockLocations)),
  updateLocation: jest.fn((req, res) => {
    const index = mockLocations.findIndex(loc => loc.id === parseInt(req.params.id));
    if (index >= 0) {
      mockLocations[index] = { ...mockLocations[index], ...req.body };
      return res.json(mockLocations[index]);
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


describe('Location API', () => {
  it('should fetch all locations', async () => {
    const response = await request(app).get('/api/location');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockLocations);
  });

  it('should fetch a location by id', async () => {
    const response = await request(app).get('/api/location/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockLocations[0]);
  });

  it('should create a new location', async () => {
    const newLocation = { name: 'New Location', latitude: 15, longitude: 25 };
    const response = await request(app).post('/api/location').send(newLocation);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(newLocation.name);
  });

  it('should fetch nearby locations', async () => {
    const response = await request(app).get('/api/location/proximity?latitude=10&longitude=20');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockLocations);
  });

  it('should update a location by id', async () => {
    const updatedLocation = { name: 'Updated Location', latitude: 15, longitude: 25 };
    const response = await request(app).put('/api/location/1').send(updatedLocation);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedLocation.name);
  });

  it('should delete a location by id', async () => {
    const response = await request(app).delete('/api/location/1');
    expect(response.status).toBe(204);
  });
});
