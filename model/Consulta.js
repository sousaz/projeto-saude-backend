const mongoose = require('mongoose')

const Consulta = mongoose.model('Consulta', {
    data: Date,
    tipo: String,
    id_paciente: String,
    id_medico: String,
    id_ubs: String
})

module.exports = Consulta