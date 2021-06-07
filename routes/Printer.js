const { request, response } = require('express');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Printer = require('../model/Printer');

// Lista todas as Impressoras
// GET /printers


router.get('/', async (request, response) => {
    try {
        const printers = await Printer.find().sort({ sxs_printer_name: 1 })
        response.json(printers);
    } catch (err) {
        response.status(500).send({
            errors: [{
                message: 'Não foi póssível obter as Impressoras'
            }]
        })
    }
});

// Lista todas as Impressora pelo ID
// GET /printers/:id

router.get('/:id', async (request, response) => {
    try {
        const printers = await Printer.findById(request.params.id)
        response.json(printers);
    } catch (err) {
        response.status(500).send({
            errors: [{
                message: `Não foi póssível obter a impressora com o ID ${request.params.id}`
            }]
        })
    }
});

const validaImpressora = [
    check("sxs_printer_name", "É obrigatório informar o nome da impressora").not().isEmpty(),
    check("sxs_printer_model", "É obrigatório informar o modelo da impressora").not().isEmpty(),
    check("sxs_printer_ip", "É obrigatório informar o ip da impressora").not().isEmpty(),
    check("sxs_printer_local", "É obrigatório informar a sala ou local da impressora").not().isEmpty()
]

// Inclui uma nova Impressora
// Post /printers

router.post('/', validaImpressora, async (request, response) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        return response.status(400).json({
            errors: errors.array()
        })
    }
    // Verifica se o nome da impressora já existe
    const { sxs_printer_name, sxs_printer_ip } = request.body
    let printer = await Printer.findOne({ sxs_printer_name })
    let printerIp = await Printer.findOne({ sxs_printer_ip })
    if (printer || printerIp)
        return response.status(200).json({
            errors: [{ message: "Já existe uma impressora com esse Nome ou IP informado" }]
        })
    try {
        let printer = new Printer(request.body)
        await printer.save()
    } catch (err) {
        return err.status(500).json({
            errors: [{ message: `Erro ao salvar a impressora: ${err.message}` }]
        })
    }
});


// Remove uma impressora
// DELETE /printers/:id

router.delete('/:id', async (request, response) => {
    await Printer.findByIdAndRemove(request.params.id)
        .then(printer => {
            response.send({ message: `Printer ${printer.sxs_printer_name} removida com sucesso!` })
        }).catch(err => {
            return response.status(500).send({
                errors: [{ message: `Não foi possível apagar a impressora com o id ${request.params.id}` }]
            })
        })
});

// Editar uma Impressora
// PUT /printers

router.put('/', validaImpressora, async (request, response) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        return response.status(400).json({
            errors: errors.array()
        })
    }
    let dados = request.body
    await Printer.findByIdAndUpdate(request.body._id, {
        $set: dados
    }, { new: true })
        .then(printer => {
            response.send({ message: `Impressora ${printer.sxs_printer_name} alterada com sucesso!` })
        }).catch(err => {
            return response.status(500).send({
                errors: [{
                    message: `Não foi possível alterar a impressora com o id ${request.body._id}`
                }]
            })
        })
});

module.exports = router