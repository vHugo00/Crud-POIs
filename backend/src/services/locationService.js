const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../../data/locations.json');

const readLocations = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler o arquivo JSON:', error);
    return [];
  }
};

const writeLocations = (locations) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(locations, null, 2));
  } catch (error) {
    console.error('Erro ao escrever no arquivo JSON:', error);
  }
};

module.exports = {
  readLocations,
  writeLocations,
};
