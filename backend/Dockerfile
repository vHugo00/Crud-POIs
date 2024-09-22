# Usa uma imagem base do Node.js
FROM node:18

# Define o diretório de trabalho no contêiner
WORKDIR /app

# Copia o package.json e o package-lock.json (caso exista)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o código-fonte para dentro do contêiner
COPY . .

# Define a porta exposta pelo contêiner
EXPOSE 5000

# Comando para rodar o ambiente de desenvolvimento
CMD ["npm", "run", "dev"]
