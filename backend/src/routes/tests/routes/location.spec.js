const request = require('supertest');
const express = require('express');
const locationRoutes = require('../../location.js');

const app = express();
app.use(express.json()); // Interpretar JSON
app.use(locationRoutes); // Rota de localização

// Mock de local para testes
const mockLocations = [
  { id: 1, name: 'Localização 1', latitude: 10, longitude: 20 },
  { id: 2, name: 'Localização 2', latitude: 30, longitude: 40 },
];

// Mock das funções do controlador de localização
jest.mock('../../../controllers/locationController', () => ({
  getAllLocations: jest.fn((req, res) => res.json(mockLocations)), // Retorna todas as localizações
  getLocationById: jest.fn((req, res) => {
    // Procura uma localização pelo ID e retorna
    const location = mockLocations.find(loc => loc.id === parseInt(req.params.id));
    if (location) {
      return res.json(location);
    }
    // Retorna erro se a localização não for encontrada
    return res.status(404).json({ error: 'Local não encontrado' });
  }),
  createLocation: jest.fn((req, res) => {
    // Cria uma nova localização a partir dos dados recebidos
    const newLocation = { id: mockLocations.length + 1, ...req.body };
    mockLocations.push(newLocation);
    return res.status(201).json(newLocation); // Retorna a nova localização com status 201
  }),
  updateLocation: jest.fn((req, res) => {
    // Atualiza uma localização existente pelo ID
    const index = mockLocations.findIndex(loc => loc.id === parseInt(req.params.id));
    if (index >= 0) {
      const updatedLocation = { ...mockLocations[index], ...req.body };
      mockLocations[index] = updatedLocation;
      return res.json(updatedLocation); // Retorna a localização atualizada
    }
    // Retorna erro se a localização não for encontrada
    return res.status(404).json({ error: 'Local não encontrado' });
  }),
  deleteLocation: jest.fn((req, res) => {
    // Deleta uma localização pelo ID
    const index = mockLocations.findIndex(loc => loc.id === parseInt(req.params.id));
    if (index >= 0) {
      mockLocations.splice(index, 1); // Remove a localização do array
      return res.status(204).json(); // Retorna status 204 sem conteúdo
    }
    // Retorna erro se a localização não for encontrada
    return res.status(404).json({ error: 'Local não encontrado' });
  }),
}));

// Descrição dos testes para a API de Localização
describe('API de Localização', () => {
  it('buscar todas as localizações', async () => {
    // Testa a obtenção de todas as localizações
    const response = await request(app).get('/api/location');
    expect(response.status).toBe(200); // Verifica o status 200
    expect(response.body).toEqual(mockLocations); // Verifica se o corpo da resposta é igual ao mock
  });

  it('buscar uma localização pelo id', async () => {
    // Testa a obtenção de uma localização específica pelo ID
    const response = await request(app).get('/api/location/1');
    expect(response.status).toBe(200); // Verifica o status 200
    expect(response.body).toEqual(mockLocations[0]); // Verifica se o corpo da resposta é igual à localização esperada
  });

  it('criar uma nova localização', async () => {
    // Testa a criação de uma nova localização
    const newLocation = { name: 'Nova Localização', latitude: 15, longitude: 25 };
    const response = await request(app).post('/api/location').send(newLocation);
    expect(response.status).toBe(201); // Verifica o status 201
    expect(response.body.name).toBe(newLocation.name); // Verifica se o nome da nova localização está correto
  });

  it('atualizar uma localização pelo id', async () => {
    // Testa a atualização de uma localização existente pelo ID
    const updatedLocation = { name: 'Localização Atualizada', latitude: 15, longitude: 25 };
    const response = await request(app).put('/api/location/1').send(updatedLocation);
    expect(response.status).toBe(200); // Verifica o status 200
    expect(response.body.name).toBe(updatedLocation.name); // Verifica se o nome da localização atualizada está correto
  });

  it('deletar uma localização pelo id', async () => {
    // Testa a exclusão de uma localização pelo ID
    const response = await request(app).delete('/api/location/1');
    expect(response.status).toBe(204); // Verifica o status 204
  });
});
