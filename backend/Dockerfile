# Imagem base do Node.js
FROM node:18

# Define diretório
WORKDIR /app

# Copia o package.json e o package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o código para dentro do contêiner
COPY . .

# Porta
EXPOSE 5000

# Executar
CMD ["npm", "run", "dev"]
