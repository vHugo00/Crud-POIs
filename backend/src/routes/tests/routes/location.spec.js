const request = require('supertest');
const express = require('express');
const locationRouter = require('../../location');
const app = express();
app.use(express.json());
app.use(locationRouter);

describe('Testes das rotas de localização', () => {
  it('GET /api/location deve retornar todas as localizações', async () => {
    const res = await request(app).get('/api/location');
    expect(res.status).toBe(200);
    // Adicione mais expectativas aqui sobre a resposta
  });

  it('POST /api/location deve criar uma nova localização', async () => {
    const newLocation = { name: 'Nova Localização', latitude: 50, longitude: 60 };
    const res = await request(app).post('/api/location').send(newLocation);
    expect(res.status).toBe(201);
    expect(res.body).toEqual(expect.objectContaining(newLocation));
  });

  it('GET /api/location/proximity deve retornar locais próximos', async () => {
    const res = await request(app).get('/api/location/proximity?latitude=10&longitude=20&maxDistance=10');
    expect(res.status).toBe(200);
    // Adicione mais expectativas sobre a resposta
  });

  it('PUT /api/location/:id deve atualizar uma localização existente', async () => {
    const updatedLocation = { name: 'Localização Atualizada', latitude: 30, longitude: 40 };
    const res = await request(app).put(`/api/location/${locationId}`).send(updatedLocation);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.objectContaining(updatedLocation));
  });

  it('DELETE /api/location/:id deve excluir uma localização existente', async () => {
    const res = await request(app).delete(`/api/location/${locationId}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Local excluído com sucesso' });
  });
});
