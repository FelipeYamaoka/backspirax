const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Criando o Schema Ramal (Telefonia)
const RamalSchema = mongoose.Schema({
    sxs_ramal_user: { type: Schema.Types.ObjectId, ref: 'user'},
    sxs_ramal_local: { type: String },
    sxs_ramal_ramal: { type: String, unique: true },
    sxs_ramal_ip: { type: String, unique: true },
    sxs_ramal_mac: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('ramal', RamalSchema);