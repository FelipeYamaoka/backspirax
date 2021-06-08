const { request, response } = require('express');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Ramal = require('../model/Ramal');


// Lista todos os Ramais
// GET /ramais

router.get('/', async (request, response) => {
    try {
        const ramais = await Ramal
            .find()
            .sort({ sxs_ramal_local: 1 })
            .populate("sxs_ramal_user", "sxs_user_name")
        response.json(ramais);
        console.log(ramais)
    } catch (err) {
        response.status(500).send({
            errors: [{
                message: 'Não foi póssível obter os Ramais'
            }]
        })
    }
});

// Lista todos os ramais pelo ID
// GET /ramais/:id

router.get('/:id', async (request, response) => {
    try {
        const ramais = await Ramal
            .findById(request.params.id)
            .populate("sxs_ramal_user", "sxs_user_name")
        response.json(ramais);
    } catch (err) {
        response.status(500).send({
            errors: [{
                message: `Não foi póssível obter o Ramal com o ID ${request.params.id}`
            }]
        })
    }
});

// Lista um Ramal pelo id do Usuário
// GET /ramais/users/:id

router.get('/users/:id', async (request, response) => {
    try {
        const ramais = await Ramal
            .find({"sxs_ramal_user": request.params.id})
            .sort({ sxs_ramal_user: 1 })
            .populate("sxs_ramal_user", "sxs_user_name")
        response.json(ramais);
    } catch (err) {
        response.status(500).send({
            errors: [{
                message: `Não foi póssível obter o Ramal com o ID ${request.params.id}`
            }]
        })
    }
});

const validaRamal = [
    check("sxs_ramal_user", "É obrigatório informar o nome do usuário").not().isEmpty(),
    check("sxs_ramal_ramal", "É obrigatório informar o ramal do usuário").not().isEmpty(),
    check("sxs_ramal_ip", "É obrigatório informar o ip do ramal do usuário").not().isEmpty(),
    check("sxs_ramal_mac", "É obrigatório informar o MAC Address do ramal do usuário").not().isEmpty()
]

router.post('/', validaRamal, async (request, response) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        return response.status(400).json({
            errors: errors.array()
        })
    }
    // Verifica se o Ramal, IP ou MAC Address já existe
    const { sxs_ramal_ramal, sxs_ramal_ip, sxs_ramal_mac } = request.body
    let ramal = await Ramal.findOne({ sxs_ramal_ramal })
    let ramalIp = await Ramal.findOne({ sxs_ramal_ip })
    let ramalMac = await Ramal.findOne({ sxs_ramal_mac })
    if (ramal /* || ramalIp || ramalMac */)
        return response.status(200).json({
            errors: [{ message: "Já existe uma ramal com esse número, IP ou MAC Address informado." }]
        })
    try {
        let ramal = new Ramal(request.body)
        await ramal.save()
    } catch (err) {
        return err.status(500).json({
            errors: [{ message: `Erro ao salvar o usuário: ${err.message}` }]
        })
    }
});

// Remove um Ramal
// DELETE /ramais/:id

router.delete('/:id', async (request, response) => {
    await Ramal.findByIdAndRemove(request.params.id)
        .then(ramal => {
            response.send({ message: `Ramal ${ramal.sxs_ramal_ramal} removido com sucesso!` })
        }).catch(err => {
            return response.status(500).send({
                errors: [{ message: `Não foi possível apagar o ramal com o id ${request.params.id}` }]
            })
        })
});

// Editar um Ramal
// PUT /ramais

router.put('/', validaRamal, async (request, response) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        return response.status(400).json({
            errors: errors.array()
        })
    }
    let dados = request.body
    await Ramal.findByIdAndUpdate(request.body._id, {
        $set: dados
    }, { new: true })
        .then(ramal => {
            response.send({ message: `Ramal ${ramal.sxs_ramal_ramal} alterado com sucesso!` })
        }).catch(err => {
            return response.status(500).send({
                errors: [{
                    message: `Não foi possível alterar o ramal com o id ${request.body._id}`
                }]
            })
        })
});


module.exports = router