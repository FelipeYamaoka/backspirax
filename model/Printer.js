const mongoose = require('mongoose');

// Criando o Schema de Printer (Impressora)
const PrinterSchema = mongoose.Schema({
    sxs_printer_name: { type: String, unique: true },
    sxs_printer_model: { type: String },
    sxs_printer_toner: { type: String },
    sxs_printer_ip: { type: String, unique: true },
    sxs_printer_local: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('printer', PrinterSchema);