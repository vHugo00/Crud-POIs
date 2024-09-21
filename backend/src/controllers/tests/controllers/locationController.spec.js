/*
  1. getAllLocations:
     - Retona todas as localizações
     - Retona um array vazio se não houver localizações
  
  2. createLocation:
     - deve criar uma nova localização com dados válidos
     - Retona um erro 400 para nome ausente
  
  3. updateLocation:
     - deve atualizar uma localização existente com dados válidos
     - Retona um erro 404 para localização não existente
     - Retona um erro 400 para nome ausente
  
  4. deleteLocation:
     - deve excluir uma localização
     - Retona um erro 404 para localização não existente
  
  5. getNearbyLocations:
     - Retona locais proximos com base na distância
     - Retona um erro 400 para parametros ausentes
*/

const { getAllLocations, createLocation, updateLocation, deleteLocation, getNearbyLocations } = require('../../locationController');
const { readLocations, writeLocations } = require('../../../services/locationService');
const { haversineDistance } = require('../../../utils/distanceUtil');

jest.mock('../../../services/locationService', () => ({
  readLocations: jest.fn(),
  writeLocations: jest.fn(),
}));

jest.mock('../../../utils/distanceUtil', () => ({
  haversineDistance: jest.fn(),
}));

describe('locationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllLocations', () => {
    it('Retona todas as localizações', () => {
      const mockLocations = [
        { id: 1, name: 'Localização 1', latitude: 10, longitude: 20 },
        { id: 2, name: 'Localização 2', latitude: 30, longitude: 40 },
      ];
      readLocations.mockReturnValue(mockLocations);

      const req = {};
      const res = { json: jest.fn() };

      getAllLocations(req, res);

      expect(res.json).toHaveBeenCalledWith(mockLocations);
    });

    it('Retona um array vazio se não houver localizações', () => {
      readLocations.mockReturnValue([]);

      const req = {};
      const res = { json: jest.fn() };

      getAllLocations(req, res);

      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('createLocation', () => {
    it('deve criar uma nova localização com dados válidos', () => {
      const mockLocations = [];
      readLocations.mockReturnValue(mockLocations);

      writeLocations.mockImplementation((locations) => {
        locations.push({ id: 1, name: 'Nova Localização', latitude: 50, longitude: 60 });
      });

      const req = { body: { name: 'Nova Localização', latitude: 50, longitude: 60 } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      createLocation(req, res);

      expect(writeLocations).toHaveBeenCalledWith(mockLocations);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Nova Localização', latitude: 50, longitude: 60 });
    });

    it('Retona um erro 400 para nome ausente', () => {
      const req = { body: { latitude: 50, longitude: 60 } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      createLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Nome é obrigatório' });
    });
  });

  describe('updateLocation', () => {
    it('deve atualizar uma localização existente com dados válidos', () => {
      const mockLocations = [{ id: 1, name: 'Localização Antiga', latitude: 10, longitude: 20 }];
      readLocations.mockReturnValue(mockLocations);
      writeLocations.mockImplementation((locations) => { });

      const req = { params: { id: '1' }, body: { name: 'Localização Atualizada', latitude: 30, longitude: 40 } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      updateLocation(req, res);

      expect(writeLocations).toHaveBeenCalledWith(mockLocations);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Localização Atualizada', latitude: 30, longitude: 40 });
    });

    it('Retona um erro 404 para localização não existente', () => {
      const mockLocations = [{ id: 1, name: 'Localização Antiga', latitude: 10, longitude: 20 }];
      readLocations.mockReturnValue(mockLocations);

      const req = { params: { id: '2' }, body: { name: 'Localização Atualizada' } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      updateLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Local não encontrado' });
    });

    it('Retona um erro 400 para nome ausente', () => {
      const mockLocations = [{ id: 1, name: 'Localização Antiga', latitude: 10, longitude: 20 }];
      readLocations.mockReturnValue(mockLocations);

      const req = { params: { id: '1' }, body: { latitude: 30, longitude: 40 } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      updateLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Nome é obrigatório' });
    });
  });

  describe('deleteLocation', () => {
    it('deve excluir uma localização existente', () => {
      const mockLocations = [{ id: 1, name: 'Local a Excluir', latitude: 10, longitude: 20 }];
      readLocations.mockReturnValue(mockLocations);
      writeLocations.mockImplementation((locations) => { });

      const req = { params: { id: '1' } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      deleteLocation(req, res);

      expect(writeLocations).toHaveBeenCalledWith([]);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Local excluído com sucesso' });
    });

    it('Retona um erro 404 para localização não existente', () => {
      const mockLocations = [{ id: 1, name: 'Local a Excluir', latitude: 10, longitude: 20 }];
      readLocations.mockReturnValue(mockLocations);

      const req = { params: { id: '2' } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      deleteLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Local não encontrado' });
    });
  });

  describe('getNearbyLocations', () => {
    it('Retona locais próximos com base na distância', () => {
      const mockLocations = [
        { id: 1, name: 'Localização 1', latitude: 10, longitude: 20 },
        { id: 2, name: 'Localização 2', latitude: 30, longitude: 40 },
      ];
      readLocations.mockReturnValue(mockLocations);
      haversineDistance.mockReturnValue(5); // Simulando a distância para o teste

      const req = { query: { latitude: '10', longitude: '20', maxDistance: '10' } };
      const res = { json: jest.fn() };

      getNearbyLocations(req, res);

      expect(res.json).toHaveBeenCalledWith(mockLocations);
    });

    it('Retona um erro 400 para parâmetros ausentes', () => {
      const req = { query: {} };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      getNearbyLocations(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Latitude, longitude e distância máxima são obrigatórios' });
    });
  });
});
