const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Criando o Schema User (Usuário)
const UserSchema = mongoose.Schema({
    sxs_user_name: { type: String },
    sxs_user_role: { type: String },
    sxs_user_local: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('user', UserSchema);