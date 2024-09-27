const { getAllLocations, createLocation, updateLocation, deleteLocation } = require('../../locationController');
const { readLocations, writeLocations } = require('../../../services/locationService');

jest.mock('../../../services/locationService', () => ({
  readLocations: jest.fn(),
  writeLocations: jest.fn(),
}));

describe('locationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllLocations', () => {
    it('Retorna todas as localizações', () => {
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

    it('Retorna um array vazio se não houver localizações', () => {
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

      const req = { body: { name: 'Nova Localização', latitude: 50, longitude: 60 } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      createLocation(req, res);

      expect(writeLocations).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Nova Localização', latitude: 50, longitude: 60 });
    });

    it('Retorna um erro 400 para nome ausente', () => {
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

      const req = { params: { id: '1' }, body: { name: 'Localização Atualizada', latitude: 30, longitude: 40 } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      updateLocation(req, res);

      expect(writeLocations).toHaveBeenCalledWith([{ id: 1, name: 'Localização Atualizada', latitude: 30, longitude: 40 }]);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Localização Atualizada', latitude: 30, longitude: 40 });
    });

    it('Retorna um erro 404 para localização não existente', () => {
      const mockLocations = [{ id: 1, name: 'Localização Antiga', latitude: 10, longitude: 20 }];
      readLocations.mockReturnValue(mockLocations);

      const req = { params: { id: '99' }, body: { name: 'Localização Atualizada', latitude: 30, longitude: 40 } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      updateLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Local não encontrado' });
    });
  });

  describe('deleteLocation', () => {
    it('deve deletar uma localização existente', () => {
      const mockLocations = [{ id: 1, name: 'Localização 1', latitude: 10, longitude: 20 }];
      readLocations.mockReturnValue(mockLocations);

      const req = { params: { id: '1' } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      deleteLocation(req, res);

      expect(writeLocations).toHaveBeenCalledWith([]);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Local excluído com sucesso' });
    });

    it('Retorna um erro 404 para localização não existente', () => {
      const mockLocations = [{ id: 1, name: 'Localização 1', latitude: 10, longitude: 20 }];
      readLocations.mockReturnValue(mockLocations);

      const req = { params: { id: '99' } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      deleteLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Local não encontrado' });
    });
  });
});
