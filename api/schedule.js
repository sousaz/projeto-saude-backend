const Paciente = require('../model/Paciente')
const Medico = require('../model/Medico')
const Consulta = require('../model/Consulta')
const Ubs = require('../model/Ubs')
const limit = 5


module.exports = {
    // carrega as consultas não marcadas
    async loadSchedule(req, res) {
        const { page, ubs, tipo } = req.params
        try {
            const consulta = await Consulta.find({ id_paciente: null, id_ubs: ubs, tipo: tipo }).skip(page * limit - limit).limit(limit).sort({data: 'asc'})
            const consultasComInfoAdicional = await Promise.all(consulta.map(async (consulta) => {
                const medico = await Medico.findById(consulta.id_medico);
                const ubs = await Ubs.findById(consulta.id_ubs);
                return {
                    ...consulta.toObject(),
                    nome_medico: medico ? medico.nome : null,
                    nome_ubs: ubs ? ubs.nome : null,
                    dia: consulta.data.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }).replaceAll("/", "-"),
                    horario: `${consulta.data.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }).split(":")[0]}:${consulta.data.toLocaleTimeString().split(":")[1]}`
                };
            }))
            res.status(200).json(consultasComInfoAdicional)
        } catch (error) {
            console.log(error);
            res.status(400).json({ msg: 'Erro na consulta'})
        }
    },
    // async loadSchedule(req, res) {
    //     const { page, ubs, tipo } = req.params
    //     console.log(dateNow());
    //     try {
    //         const consulta = await Consulta.find({ id_paciente: null, id_ubs: ubs, tipo: tipo, data: { $gte: dateNow().dateLocalFormated } }).skip(page * limit - limit).limit(limit)
    //         const consultasComInfoAdicional = await Promise.all(consulta.map(async (consulta) => {
    //             const medico = await Medico.findById(consulta.id_medico);
    //             const ubs = await Ubs.findById(consulta.id_ubs);

    //             console.log(new Date(consulta.data.split("-").reverse().join("-")) > new Date(dateNow().dateLocalFormated.split("-").reverse().join("-")));
    //             if((new Date(consulta.data.split("-").reverse().join("-")) > new Date(dateNow().dateLocalFormated.split("-").reverse().join("-"))) || (consulta.horario > dateNow().hourLocal)){
    //                 return {
    //                     ...consulta.toObject(),
    //                     nome_medico: medico ? medico.nome : null,
    //                     nome_ubs: ubs ? ubs.nome : null,
    //                 };
    //             }
    //         }))
    //         res.status(200).json(consultasComInfoAdicional)
    //     } catch (error) {
    //         console.log(error);
    //         res.status(400).json({ msg: 'Erro na consulta'})
    //     }
    // },
    //marca a consulta para um paciente
    async makeSchedule(req, res) {
        const { horario, data, tipo, id_medico, id_ubs, id_paciente } = req.body
        const id = req.params.id

        if(!horario)
            return res.status(422).json({ msg: "O horario é obrigatório!" })
        if(!data)
            return res.status(422).json({ msg: "A data é obrigatório!" })
        if(!tipo)
            return res.status(422).json({ msg: "O tipo de consulta é obrigatório!" })
        if(!id_medico)
            return res.status(422).json({ msg: "O médico é obrigatório!" })
        if(!id_paciente)
            return res.status(422).json({ msg: "O paciente é obrigatório!" })
        if(!id_ubs)
            return res.status(422).json({ msg: "A ubs é obrigatório!" })

        const consultaExiste = await Consulta.findById(id)

        if(!consultaExiste)
            return res.status(422).json({ msg: "Consulta não disponivel!" })

        const pacienteExiste = await Paciente.findById(id_paciente)

        if(!pacienteExiste)
            return res.status(422).json({ msg: "Paciente não existe!" })

        try {
            consultaExiste.horario = horario
            consultaExiste.data = data
            consultaExiste.tipo = tipo
            consultaExiste.id_medico = id_medico
            consultaExiste.id_paciente = id_paciente

            await consultaExiste.save()
            res.status(200).json({ msg: "Consulta marcada com sucesso!" })
        } catch (error) {
            res.status(400).json({ msg: 'Erro ao marcar consulta!' })
        }
    }, 
    async cancelSchedule(req, res) {
        const { horario, data, tipo, id_medico, id_ubs, id_paciente } = req.body
        const id = req.params.id

        if(!horario)
            return res.status(422).json({ msg: "O horario é obrigatório!" })
        if(!data)
            return res.status(422).json({ msg: "A data é obrigatório!" })
        if(!tipo)
            return res.status(422).json({ msg: "O tipo de consulta é obrigatório!" })
        if(!id_medico)
            return res.status(422).json({ msg: "O médico é obrigatório!" })
        if(!id_paciente)
            return res.status(422).json({ msg: "O paciente é obrigatório!" })
        if(!id_ubs)
            return res.status(422).json({ msg: "A ubs é obrigatório!" })

        const consultaExiste = await Consulta.findById(id)

        if(!consultaExiste)
            return res.status(422).json({ msg: "Consulta não disponivel!" })

        const mesmoPaciente = consultaExiste.id_paciente === id_paciente

        if(!mesmoPaciente)
            return res.status(422).json({ msg: "Não vai rolar!" })

        try {
            consultaExiste.horario = horario
            consultaExiste.data = data
            consultaExiste.tipo = tipo
            consultaExiste.id_medico = id_medico
            consultaExiste.id_paciente = null

            await consultaExiste.save()
            res.status(200).json({ msg: "Consulta cancelada com sucesso!" })
        } catch (error) {
            res.status(400).json({ msg: 'Erro ao cancelar consulta' })
        }
    }, 

    //carregar as consultas marcadas pelo paciente
    async loadUserSchedule(req, res) {
        const id = req.params.id
        const page = req.params.page
        try {
            const consulta = await Consulta.find({ id_paciente: id }).skip(page * limit - limit).limit(limit).sort({data: 'asc'})
            const consultasComInfoAdicional = await Promise.all(consulta.map(async (consulta) => {
                const medico = await Medico.findById(consulta.id_medico);
                const ubs = await Ubs.findById(consulta.id_ubs);
    
                return {
                    ...consulta.toObject(),
                    nome_medico: medico ? medico.nome : null,
                    nome_ubs: ubs ? ubs.nome : null,
                    dia: consulta.data.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }).replaceAll("/", "-"),
                    horario: `${consulta.data.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }).split(":")[0]}:${consulta.data.toLocaleTimeString().split(":")[1]}`
                };
            }));
            res.status(200).json(consultasComInfoAdicional)
        } catch (error) {
            res.status(400).json({ msg: 'Erro na consulta'})
        }
    },
    async loadAllSchedules(req, res) {
        const page = req.params.page
        const id = req.params.id
        try {
            const consulta = await Consulta.find({id_ubs: id}).skip(page * limit - limit).limit(limit).sort({data: 'asc'})
            const consultasComInfoAdicional = await Promise.all(consulta.map(async (consulta) => {
                const medico = await Medico.findById(consulta.id_medico);
                const paciente = await Paciente.findById(consulta.id_paciente)
    
                return {
                    ...consulta.toObject(),
                    nome_medico: medico ? medico.nome : null,
                    nome_paciente: paciente ? `${paciente.nome} ${paciente.sobrenome}` : null,
                    dia: consulta.data.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }).replaceAll("/", "-"),
                    horario: `${consulta.data.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }).split(":")[0]}:${consulta.data.toLocaleTimeString().split(":")[1]}`
                };
            }));
            res.status(200).json(consultasComInfoAdicional)
        } catch (error) {
            res.status(400).json({ msg: "Erro ao carregar tabela!"})
        }
    },
    async deleteSchedule(req, res) {
        try {
            const id = req.params.id

            const consulta = await Consulta.deleteOne({ _id: id })
            if(!consulta) {
                return res.status(400).json({ msg: "Consulta não encontrada" })
            }

            res.status(201).json({ msg: "consulta apagada"})
        } catch (error) {
            res.status(400).json({ error: 'Consulta não encontrada'})
        }
    },
    // async teste(req, res) {
    //     const page = 2
    //     try {
    //         const consulta = await Consulta.find().skip(page * limit - limit).limit(limit).sort({data: 'asc'})
    //         const consultasComInfoAdicional = await Promise.all(consulta.map(async (consulta) => {
    //             const medico = await Medico.findById(consulta.id_medico);
    //             const ubs = await Ubs.findById(consulta.id_ubs);
    //             const paciente = await Paciente.findById(consulta.id_paciente)
    
    //             return {
    //                 ...consulta.toObject(),
    //                 nome_medico: medico ? medico.nome : null,
    //                 nome_ubs: ubs ? ubs.nome : null,
    //                 nome_paciente: paciente ? `${paciente.nome} ${paciente.sobrenome}` : null,
    //                 dia: consulta.data.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }).replaceAll("/", "-"),
    //                 horario: `${consulta.data.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }).split(":")[0]}:${consulta.data.toLocaleTimeString().split(":")[1]}`
    //             };
    //         }));
    //         res.status(200).json(consultasComInfoAdicional)
    //     } catch (error) {
    //         console.log(error)
    //         res.status(400).json({ msg: error})
    //     }
    // },

}