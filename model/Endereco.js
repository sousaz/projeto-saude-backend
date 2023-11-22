const mongoose = require('mongoose')

const Endereco = mongoose.model('Endereco', {
    cep: String,
    rua: String,
    bairro: String,
    cidade: String,
    estado:String,
    numero: String
})

module.exports = Endereco