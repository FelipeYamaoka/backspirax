const express = require('express');
require('dotenv').config() // Carrega as variáveis de ambiente
const InicializaMongoServer = require('./config/Db');

// Definindo as rotas da aplicação
const rotasCompany = require('./routes/Company');

// Inicializamos o servidor MongoDB
InicializaMongoServer();

const app = express();
// Porta Default 
const PORT = process.env.PORT;
// Parse conteúdo json
app.use(express.json());

app.get('/', (request, response) => {
    response.json({
        mensagem: "API Spirax 100% Funcional",
        versao: '1.0.0',
    });
});

app.get('/fatec', (request, response) => {
    response.json({
        mensagem: "API FATEC 100% Funcional",
        versao: '1.0.0',
    });
});

// Rotas da Categoria
app.use('/company', rotasCompany);

app.listen(PORT, (request, response) => {
    console.log(`Servidor Web iniciado na porta ${PORT}`)
});