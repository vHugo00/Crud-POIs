---

# Sistema para Cadastro de POIs

Este é um sistema simples para gerenciar pontos de interesse (POIs). Ele permite criar, listar, buscar, editar e deletar locais. Além disso, você pode buscar locais por nome ou proximidade.

## Funcionalidades

- **Criar novos locais**: Adicione pontos de interesse ao sistema.
- **Listar locais**: Visualize todos os locais cadastrados.
- **Buscar locais**: Pesquise locais por nome ou proximidade.
- **Editar locais**: Atualize as informações de um local.
- **Deletar locais**: Remova locais do sistema.

## Tecnologias Utilizadas

### Backend
- **Node.js**
- **Express**
- **Axios**
- **CORS**
- **JSON Server**

### Frontend
- **Next.js**
- **React**
- **Tailwind CSS**

### Testes
- **Jest**

### Contêinerização
- **Docker**

## Instruções de Execução

### Executando com Docker

1. Clone este repositório:
   ```bash
   git clone <URL-do-repositório>
   ```

2. Acesse o diretório raiz do projeto:
   ```bash
   cd <diretório-do-projeto>
   ```

3. Execute o Docker Compose para iniciar o sistema:
   ```bash
   docker-compose up --build
   ```

   O frontend estará disponível em [http://localhost:3000](http://localhost:3000) e o backend em [http://localhost:5000](http://localhost:5000).

### Executando Manualmente

Caso prefira executar os servidores sem Docker, siga os passos abaixo:

#### Backend

1. Acesse o diretório do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor:
   ```bash
   npm run dev
   ```

4. O backend estará rodando em [http://localhost:5000](http://localhost:5000).

#### Frontend

1. Acesse o diretório do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor do frontend:
   ```bash
   npm run dev
   ```

4. O frontend estará rodando em [http://localhost:3000](http://localhost:3000).

### Executando Testes

Para rodar os testes, use o comando:

```bash
npm test
```

Isso irá executar todos os testes definidos com o Jest para garantir que a aplicação esteja funcionando corretamente.

---
