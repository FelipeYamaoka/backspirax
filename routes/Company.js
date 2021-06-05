const express = require('express');
const router = express.Router();
const Company = require('../model/Company');

/*************************
 * Lista todas as Company
 * GET /companies
 *************************/

router.get('/', async (request, response) => {
    try {
        const companies = await Company.find()
        response.json(companies);
    } catch (err) {
        response.status(500).send({
            errors: [{
                message: 'Não foi póssível obter as Empresas'
            }]
        })
    }
})

module.exports = router