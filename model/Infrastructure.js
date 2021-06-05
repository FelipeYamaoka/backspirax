const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Criando o Schema Infrastructure (Infraestrutura)
const InfrastructureSchema = mongoose.Schema({
    sxs_infra_user: { type: Schema.Types.ObjectId, ref: 'user'},
    sxs_infra_hostname: { type: String, unique: true },
    sxs_infra_model: { type: String },
    sxs_infra_local: { type: String },
    sxs_infra_cisco_amp: { type: String },
    sxs_infra_bomgar: { type: String, enum: ['Yes', 'NONE'], default: 'NONE' },
    sxs_infra_sccm: { type: String, enum: ['Yes', 'NONE'], default: 'NONE' },
    sxs_infra_service_tag: { type: String, unique: true},
    sxs_infra_os: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('infrastructure', InfrastructureSchema);