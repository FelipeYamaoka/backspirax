const { request, response } = require('express');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Infra = require('../model/Infrastructure');


// Lista toda a infraestrutura
// GET /infra

router.get('/', async (request, response) => {
    try {
        const infras = await Infra
            .find()
            .sort({ sxs_infra_user: 1 })
            .populate("sxs_infra_user", "sxs_user_name")
        response.json(infras);
        console.log(infras)
    } catch (err) {
        response.status(500).send({
            errors: [{
                message: 'Não foi póssível obter a máquina'
            }]
        })
    }
});


// Lista toda a infraestrutura
// GET /infra/:id

router.get('/:id', async (request, response) => {
    try {
        const infras = await Infra
            .findById(request.params.id)
            .populate("sxs_infra_user", "sxs_user_name")
        response.json(infras);
    } catch (err) {
        response.status(500).send({
            errors: [{
                message: `Não foi póssível obter a máquina com o ID ${request.params.id}`
            }]
        })
    }
});


// Lista uma máquina pelo ID do usuário
// GET /infra/users/:id

router.get('/users/:id', async (request, response) => {
    try {
        const infras = await Infra
            .find({"sxs_infra_user": request.params.id})
            .sort({ sxs_infra_user: 1 })
            .populate("sxs_infra_user", "sxs_user_name")
        response.json(infras);
    } catch (err) {
        response.status(500).send({
            errors: [{
                message: 'Não foi póssível obter a máquina do usuário'
            }]
        })
    }
});


const validaInfra = [
    check("sxs_infra_user", "É obrigatório informar o nome do usuário").not().isEmpty(),
    check("sxs_infra_hostname", "É obrigatório informar o nome do máquina").not().isEmpty(),
    check("sxs_infra_local", "É obrigatório informar o setor").not().isEmpty(),
    check("sxs_infra_cisco_amp", "É obrigatório informar a versão do AMP").not().isEmpty(),
    check("sxs_infra_bomgar", "É obrigatório informar se possuí ou não o BOMGAR").isIn(['Yes', 'NONE']),
    check("sxs_infra_sccm", "É obrigatório informar se possuí ou não o SCCM").isIn(['Yes', 'NONE']),
    check("sxs_infra_service_tag", "É obrigatório informar o Service TAG").not().isEmpty(),
    check("sxs_infra_os", "É obrigatório informar o sistema operacional").not().isEmpty()
]

router.post('/', validaInfra, async (request, response) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        return response.status(400).json({
            errors: errors.array()
        })
    }
    // Verifica se o hostname ou service tag já existem
    const { sxs_infra_hostname, sxs_infra_service_tag } = request.body
    let hostname = await Infra.findOne({ sxs_infra_hostname })
    let serviceTag = await Infra.findOne({ sxs_infra_service_tag })
    if (hostname || serviceTag)
        return response.status(200).json({
            errors: [{ message: "Já existe um HOSTNAME com esse nome ou SERVICE TAG com esse serviço." }]
        })
    try {
        let infra = new Infra(request.body)
        await infra.save()
    } catch (err) {
        return err.status(500).json({
            errors: [{ message: `Erro ao salvar a máquina: ${err.message}` }]
        })
    }
});


// Remove uma máquina
// DELETE /infra/:id

router.delete('/:id', async (request, response) => {
    await Infra.findByIdAndRemove(request.params.id)
        .then(infra => {
            response.send({ message: `Máquina ${infra.sxs_infra_hostname} removido(a) com sucesso!` })
        }).catch(err => {
            return response.status(500).send({
                errors: [{ message: `Não foi possível apagar a máquina com o id ${request.params.id}` }]
            })
        })
});

// Editar uma máquina
// PUT /infra

router.put('/', validaInfra, async (request, response) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        return response.status(400).json({
            errors: errors.array()
        })
    }
    let dados = request.body
    await Infra.findByIdAndUpdate(request.body._id, {
        $set: dados
    }, { new: true })
        .then(infra => {
            response.send({ message: `Máquina ${infra.sxs_infra_hostname} alterado(a) com sucesso!` })
        }).catch(err => {
            return response.status(500).send({
                errors: [{
                    message: `Não foi possível alterar a máquina com o id ${request.body._id}`
                }]
            })
        })
});

module.exports = router