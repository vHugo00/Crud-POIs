const { getAllLocations, createLocation } = require('../../locationController');
const { readLocations, writeLocations } = require('../../../services/locationService');

jest.mock('../../../services/locationService', () => ({
  readLocations: jest.fn(),
  writeLocations: jest.fn(),
}));

describe('serviço de localização', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllLocations', () => {
    it('retornar todas as localizações', () => {
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

    it('retornar um array vazio se não houver localizações', () => {
      readLocations.mockReturnValue([]);

      const req = {};
      const res = { json: jest.fn() };

      getAllLocations(req, res);

      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('createLocation', () => {
    it('criar uma nova localização com dados válidos', () => {
      const mockLocations = [];
      readLocations.mockReturnValue(mockLocations);

      writeLocations.mockImplementation((locations) => {
        const newLocation = { id: 1, name: 'Nova Localização', latitude: 50, longitude: 60 };
        locations.push(newLocation);
        return newLocation;
      });

      const req = { body: { name: 'Nova Localização', latitude: 50, longitude: 60 } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      createLocation(req, res);

      expect(writeLocations).toHaveBeenCalledWith(mockLocations);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Nova Localização', latitude: 50, longitude: 60 });
    });

    it('retornar um erro 400 para nome ausente', () => {
      const req = { body: { latitude: 50, longitude: 60 } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      createLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Nome é obrigatório' });
    });
  });
});
