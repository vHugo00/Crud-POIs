# Dockerfile do Frontend
FROM node:18-alpine AS build

# Define o diretório
WORKDIR /app

# Copia o package.json e instala as dependências
COPY package*.json ./
RUN npm install

# Copia todos os arquivos de origem
COPY . .

# Constrói a aplicação Next.js
RUN npm run build

# Estágio 2: Contêiner de produção
FROM node:18-alpine AS production

# Define o diretório
WORKDIR /app

# Copia os arquivos
COPY --from=build /app ./

# Porta
EXPOSE 3000

# Inicia 
CMD ["npm", "start"]
