const fs = require('fs');
const path = require('path');
const { readLocations, writeLocations } = require('../locationService.js');

jest.mock('fs');

const filePath = path.join(__dirname, '../../../data/locations.json');

describe('Locations Module', () => {
  const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorMock.mockRestore();
  });

  test('should read locations from JSON file', () => {
    const mockData = JSON.stringify([{ id: 1, name: 'Location A' }]);
    fs.readFileSync.mockReturnValue(mockData);

    const locations = readLocations();

    expect(locations).toEqual([{ id: 1, name: 'Location A' }]);
    expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf8');
  });

  test('should return empty array on read error', () => {
    fs.readFileSync.mockImplementation(() => {
      throw new Error('File not found');
    });

    const locations = readLocations();

    expect(locations).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Erro ao ler o arquivo JSON:', expect.any(Error));
  });

  test('should write locations to JSON file', () => {
    const locations = [{ id: 1, name: 'Location A' }];
    writeLocations(locations);

    expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, JSON.stringify(locations, null, 2));
  });

  test('should handle write error', () => {
    fs.writeFileSync.mockImplementation(() => {
      throw new Error('Write failed');
    });

    writeLocations([]);

    expect(console.error).toHaveBeenCalledWith('Erro ao escrever no arquivo JSON:', expect.any(Error));
  });
});
