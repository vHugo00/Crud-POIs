const express = require('express');
const locationRoutes = require('./routes/location');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Rotas
app.use(locationRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
