const mongoose = require('mongoose');

// Criando o Schema do Company (Empresa)
const CompanySchema = mongoose.Schema({
    sxs_company_country: { type: String},
    sxs_company_name: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('company', CompanySchema);