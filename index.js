const express = require('express');
require('dotenv').config() // Carrega as variáveis de ambiente
const InicializaMongoServer = require('./config/Db');

// Definindo as rotas da aplicação
const rotasCompany = require('./routes/Company');
const rotasPrinter = require('./routes/Printer');
const rotasRamal = require('./routes/Ramal');
const rotasUser = require('./routes/User');

// Inicializamos o servidor MongoDB
InicializaMongoServer();

const app = express();
// Porta Default 

//Removendo o x-powered-by por segurança
app.disable('x-powered-by')

const PORT = process.env.PORT || 4001;

//Middleware do Express
app.use(function (request, response, next) {
    //Em produção, remova o * e atualize com o domínio/ip do seu app
    response.setHeader('Access-Control-Allow-Origin', '*')
    //Cabeçalhos que serão permitidos
    response.setHeader('Access-Control-Allow-Headers', '*')
    //Ex: res.setHeader('Access-Control-Allow-Headers','Content-Type, Accept, access-token')
    //Métodos que serão permitidos
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
    next()
})

// Definimos que o BACKEND fará o parse do JSON
app.use(express.json());

// Rota inicial de teste
app.get('/', (request, response) => {
    response.json({
        mensagem: "API Spirax 100% Funcional",
        versao: '1.0.0',
    });
});

// Rotas da Categoria
app.use('/company', rotasCompany);
app.use('/printers', rotasPrinter);
app.use('/ramais', rotasRamal);
app.use('/users', rotasUser);


//Rota para tratar erros 404 (deve ser a última sempre!)
app.use(function (request, response) {
    response.status(404).json({
        mensagem: `A rota ${request.originalUrl} não existe!`
    })
})

app.listen(PORT, (request, response) => {
    console.log(`Servidor Web iniciado na porta ${PORT}`)
});