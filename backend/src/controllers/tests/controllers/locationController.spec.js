// Importa as funções necessárias do controlador e serviços
const { getAllLocations, createLocation, updateLocation, deleteLocation } = require('../../locationController');
const { readLocations, writeLocations } = require('../../../services/locationService');

// Mock das funções do serviço de localização
jest.mock('../../../services/locationService', () => ({
  readLocations: jest.fn(),
  writeLocations: jest.fn(),
}));

describe('locationService', () => {
  // Limpa os mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Testes para a função getAllLocations
  describe('getAllLocations', () => {
    it('Retorna todas as localizações', () => {
      // Mock de localizações
      const mockLocations = [
        { id: 1, name: 'Localização 1', latitude: 10, longitude: 20 },
        { id: 2, name: 'Localização 2', latitude: 30, longitude: 40 },
      ];
      // Configura o mock para retornar as localizações
      readLocations.mockReturnValue(mockLocations);

      const req = {}; // Simulação do objeto de requisição
      const res = { json: jest.fn() }; // Simulação do objeto de resposta

      // Chama a função getAllLocations
      getAllLocations(req, res);

      // Verifica se a resposta retorna as localizações
      expect(res.json).toHaveBeenCalledWith(mockLocations);
    });

    it('Retorna um array vazio se não houver localizações', () => {
      // Configura o mock para retornar um array vazio
      readLocations.mockReturnValue([]);

      const req = {};
      const res = { json: jest.fn() };

      // Chama a função getAllLocations
      getAllLocations(req, res);

      // Verifica se a resposta retorna um array vazio
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  // Testes para a função createLocation
  describe('createLocation', () => {
    it('deve criar uma nova localização com dados válidos', () => {
      const mockLocations = []; // Array vazio para simular novas localizações
      readLocations.mockReturnValue(mockLocations);

      const req = { body: { name: 'Nova Localização', latitude: 50, longitude: 60 } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      // Chama a função createLocation
      createLocation(req, res);

      // Verifica se a função writeLocations foi chamada e se a resposta está correta
      expect(writeLocations).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Nova Localização', latitude: 50, longitude: 60 });
    });

    it('Retorna um erro 400 para nome ausente', () => {
      const req = { body: { latitude: 50, longitude: 60 } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      // Chama a função createLocation
      createLocation(req, res);

      // Verifica se a resposta de erro é retornada
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Nome é obrigatório' });
    });
  });

  // Testes para a função updateLocation
  describe('updateLocation', () => {
    it('deve atualizar uma localização existente com dados válidos', () => {
      const mockLocations = [{ id: 1, name: 'Localização Antiga', latitude: 10, longitude: 20 }];
      readLocations.mockReturnValue(mockLocations);

      const req = { params: { id: '1' }, body: { name: 'Localização Atualizada', latitude: 30, longitude: 40 } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      // Chama a função updateLocation
      updateLocation(req, res);

      // Verifica se a localização foi atualizada corretamente
      expect(writeLocations).toHaveBeenCalledWith([{ id: 1, name: 'Localização Atualizada', latitude: 30, longitude: 40 }]);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Localização Atualizada', latitude: 30, longitude: 40 });
    });

    it('Retorna um erro 404 para localização não existente', () => {
      const mockLocations = [{ id: 1, name: 'Localização Antiga', latitude: 10, longitude: 20 }];
      readLocations.mockReturnValue(mockLocations);

      const req = { params: { id: '99' }, body: { name: 'Localização Atualizada', latitude: 30, longitude: 40 } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      // Chama a função updateLocation
      updateLocation(req, res);

      // Verifica se a resposta de erro é retornada
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Local não encontrado' });
    });
  });

  // Testes para a função deleteLocation
  describe('deleteLocation', () => {
    it('deve deletar uma localização existente', () => {
      const mockLocations = [{ id: 1, name: 'Localização 1', latitude: 10, longitude: 20 }];
      readLocations.mockReturnValue(mockLocations);

      const req = { params: { id: '1' } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      // Chama a função deleteLocation
      deleteLocation(req, res);

      // Verifica se a localização foi excluída corretamente
      expect(writeLocations).toHaveBeenCalledWith([]);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Local excluído com sucesso' });
    });

    it('Retorna um erro 404 para localização não existente', () => {
      const mockLocations = [{ id: 1, name: 'Localização 1', latitude: 10, longitude: 20 }];
      readLocations.mockReturnValue(mockLocations);

      const req = { params: { id: '99' } };
      const res = { status: jest.fn(() => res), json: jest.fn() };

      // Chama a função deleteLocation
      deleteLocation(req, res);

      // Verifica se a resposta de erro é retornada
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Local não encontrado' });
    });
  });
});
