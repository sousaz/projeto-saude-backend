const Medico = require("../model/Medico")
const Ubs = require("../model/Ubs")


module.exports = {
    async createDoctor(req, res) {
        const { cpf, nome, crm, especialidade, id_ubs } = req.body

        if(!cpf)
            return res.status(422).json({ msg: "O cpf é obrigatório!" })
        if(!nome)
            return res.status(422).json({ msg: "O nome é obrigatório!" })
        if(!crm)
            return res.status(422).json({ msg: "O crm é obrigatório!" })
        if(!especialidade)
            return res.status(422).json({ msg: "A especialidade é obrigatório!" })
        if(!id_ubs)
            return res.status(422).json({ msg: "A Ubs é obrigatório!" })

        const doutorExiste = await Medico.findOne({ cpf })

        if(doutorExiste)
            return res.status(422).json({ msg: "Médico já cadastrado!" })

        const ubsExiste = await Ubs.findOne({ id: id_ubs })

        if(!ubsExiste)
            return res.status(422).json({ msg: "Ubs não cadastrado!" })


        // verificar se a especialidade é a especialidade do medico
        const medico = new Medico({
            cpf, nome, crm, especialidade, id_ubs
        })

        try {
            await medico.save()
            res.status(200).json({ msg: "inserido na tabela medico com sucesso" })
        } catch (error) {
            res.status(400).json({ msg: 'Erro ao adicionar na tabela medico' })
        }
    }
}