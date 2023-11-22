const mongoose = require('mongoose')

const Ubs = mongoose.model('Ubs', {
    usuario: String,
    senha: String,
    nome: String,
    id_endereco: String,
    admin: Boolean
})

module.exports = Ubs