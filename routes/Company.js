const { request, response } = require('express');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Company = require('../model/Company');


// Lista todas as Company
// GET /companies


router.get('/', async (request, response) => {
    try {
        const companies = await Company.find().sort({ sxs_company_name: 1 })
        response.json(companies);
    } catch (err) {
        response.status(500).send({
            errors: [{
                message: 'Não foi póssível obter as Empresas'
            }]
        })
    }
});

// Lista todas uma Company pelo ID
// GET /companies/:id

router.get('/:id', async (request, response) => {
    try {
        const companies = await Company.findById(request.params.id)
        response.json(companies);
    } catch (err) {
        response.status(500).send({
            errors: [{
                message: `Não foi póssível obter a empresa com o ID ${request.params.id}`
            }]
        })
    }
});

const validaCompanhia = [
    check("sxs_company_country", "É obrigatório informar o país de origem da companhia").not().isEmpty(),
    check("sxs_company_name", "É obrigatório informar o nome da companhia").not().isEmpty()
]

// Inclui uma nova Company
// Post /company

router.post('/', validaCompanhia, async (request, response) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        return response.status(400).json({
            errors: errors.array()
        })
    }
    // Verifica se o nome da companhia já existe
    const { sxs_company_name } = request.body
    let company = await Company.findOne({ sxs_company_name })
    if (company)
        return response.status(200).json({
            errors: [{ message: "Já existe uma companhia com esse nome informado" }]
        })
    try {
        let company = new Company(request.body)
        await company.save()
    } catch (err) {
        return err.status(500).json({
            errors: [{ message: `Erro ao salvar a companhia: ${err.message}` }]
        })
    }
});

// Remove uma companhia
// DELETE /company/:id

router.delete('/:id', async (request, response) => {
    await Company.findByIdAndRemove(request.params.id)
        .then(company => {
            response.send({ message: `Company ${company.sxs_company_name} removida com sucesso!` })
        }).catch(err => {
            return response.status(500).send({
                errors: [{ message: `Não foi possível apagar a companhia com o id ${request.params.id}` }]
            })
        })
});

// Editar uma companhia
// PUT /company

router.put('/', validaCompanhia, async (request, response) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        return response.status(400).json({
            errors: errors.array()
        })
    }
    let dados = request.body
    await Company.findByIdAndUpdate(request.body._id, {
        $set: dados
    }, { new: true })
        .then(companhia => {
            response.send({ message: `Companhia ${companhia.sxs_company_name} alterada com sucesso!` })
        }).catch(err => {
            return response.status(500).send({
                errors: [{
                    message: `Não foi possível alterar a companhia com o id ${request.body._id}`
                }]
            })
        })
});

module.exports = router