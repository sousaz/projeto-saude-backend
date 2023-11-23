const mongoose = require('mongoose')

const Medico = mongoose.model('Medico', {
    cpf: String,
    nome: String,
    crm: String,
    especialidade: String,
    id_ubs: String
})

module.exports = Medico