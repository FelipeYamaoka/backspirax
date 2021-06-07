const { request, response } = require('express');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const User = require('../model/User');


// Lista todos os usuários
// GET /printers

router.get('/', async (request, response) => {
    try {
        const users = await User.find().sort({ sxs_user_name: 1 })
        response.json(users);
    } catch (err) {
        response.status(500).send({
            errors: [{
                message: 'Não foi póssível obter os Usuários'
            }]
        })
    }
});

// Lista todos os usuários pelo ID
// GET /users/:id

router.get('/:id', async (request, response) => {
    try {
        const users = await User.findById(request.params.id)
        response.json(users);
    } catch (err) {
        response.status(500).send({
            errors: [{
                message: `Não foi póssível obter o usuário com o ID ${request.params.id}`
            }]
        })
    }
});

const validaUsuario = [
    check("sxs_user_name", "É obrigatório informar o nome do usuário").not().isEmpty(),
    check("sxs_user_role", "É obrigatório informar a ocupação/profissão do usuário").not().isEmpty(),
    check("sxs_user_local", "É obrigatório informar a sala ou local de trabalho do usuário").not().isEmpty()
]

// Inclui um novo usuário
// Post /users

router.post('/', validaUsuario, async (request, response) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        return response.status(400).json({
            errors: errors.array()
        })
    }
    try {
        let user = new User(request.body)
        await user.save()
    } catch (err) {
        return err.status(500).json({
            errors: [{ message: `Erro ao salvar o usuário: ${err.message}` }]
        })
    }
});

// Remove um usuário
// DELETE /users/:id

router.delete('/:id', async (request, response) => {
    await User.findByIdAndRemove(request.params.id)
        .then(user => {
            response.send({ message: `Usuário ${user.sxs_user_name} removido(a) com sucesso!` })
        }).catch(err => {
            return response.status(500).send({
                errors: [{ message: `Não foi possível apagar o usuário com o id ${request.params.id}` }]
            })
        })
});

// Editar um usuário
// PUT /users

router.put('/', validaUsuario, async (request, response) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        return response.status(400).json({
            errors: errors.array()
        })
    }
    let dados = request.body
    await User.findByIdAndUpdate(request.body._id, {
        $set: dados
    }, { new: true })
        .then(user => {
            response.send({ message: `Usuário ${user.sxs_user_name} alterado(a) com sucesso!` })
        }).catch(err => {
            return response.status(500).send({
                errors: [{
                    message: `Não foi possível alterar o usuário com o id ${request.body._id}`
                }]
            })
        })
});


module.exports = router