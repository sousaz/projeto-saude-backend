const mongoose = require('mongoose')

const Medico = mongoose.model('Medico', {
    cpf: String,
    nome: String,
    crm: String,
    especialidade: String
})

module.exports = Medico