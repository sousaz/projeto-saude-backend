const Ubs = require("../model/Ubs")
const Endereco = require("../model/Endereco")
const bcrypt = require("bcrypt")
require("dotenv").config()

module.exports = {
    async createUbs(req, res) {
        const { usuario, senha, nome, cep, rua, bairro, cidade, estado, numero } = req.body
        if(!cep)
            return res.status(422).json({ msg: "O cep é obrigatório!" })
        if(!rua)
            return res.status(422).json({ msg: "A rua é obrigatório!" })
        if(!bairro)
            return res.status(422).json({ msg: "O bairro é obrigatório!" })
        if(!cidade)
            return res.status(422).json({ msg: "A cidade é obrigatório!" })
        if(!estado)
            return res.status(422).json({ msg: "O estado é obrigatório!" })
        if(!numero)
            return res.status(422).json({ msg: "O numero da casa é obrigatório!" })
        if(!usuario)
            return res.status(422).json({ msg: "O usuario é obrigatório!" })
        if(!senha)
            return res.status(422).json({ msg: "A senha é obrigatório!" })
        if(!nome)
            return res.status(422).json({ msg: "O nome é obrigatório!" })

        try {
            const ubsUsuarioExiste = await Ubs.findOne({ usuario })
            if(ubsUsuarioExiste)
                return res.status(422).json({ msg: "usuario existente!"})
            const ubsNomeExiste = await Ubs.findOne({ nome })
            if(ubsNomeExiste)
                return res.status(422).json({ msg: "Nome existente!"})
            const enderecoEncontrado = await Endereco.findOne({cep, rua, bairro, cidade, estado, numero});
            const novo_endereco = new Endereco({
                cep,
                rua,
                bairro,
                cidade,
                estado,
                numero
            })
            const endereco = enderecoEncontrado ? enderecoEncontrado : await novo_endereco.save();
            const salt = await bcrypt.genSalt(12)
            const passWordHash = await bcrypt.hash(senha, salt)

            const ubs = new Ubs({
                usuario, senha: passWordHash, nome, id_endereco: endereco.id, admin: true
            })

            await ubs.save()
            res.status(200).json({ msg: "Ubs cadastrada com sucesso"})
        } catch (error) {
            res.status(400).json({ msg: 'Erro ao cadastrar ubs'})
        }
    }
}