const Consulta = require("../model/Consulta")
const Medico = require("../model/Medico")
const Paciente = require("../model/Paciente")
const Ubs = require("../model/Ubs")

module.exports = {
    // async createQuery(req, res) {
    //     const { horario, data, tipo, id_medico, id_ubs } = req.body

    //     if(!horario)
    //         return res.status(422).json({ msg: "O horario é obrigatório!" })
    //     if(!data)
    //         return res.status(422).json({ msg: "A data é obrigatório!" })
    //     if(!id_medico)
    //         return res.status(422).json({ msg: "O médico é obrigatório!" })
    //     if(!tipo)
    //         return res.status(422).json({ msg: "O tipo de consulta é obrigatório!" })
    //     if(!id_ubs)
    //         return res.status(422).json({ msg: "A ubs é obrigatório!" })

    //     const consultaExiste = await Consulta.findOne({ horario, data, id_ubs })

    //     if(consultaExiste)
    //         return res.status(422).json({ msg: "Choque de horario!" })

    //     const medicoExiste = await Medico.findById(id_medico)

    //     if(!medicoExiste)
    //         return res.status(422).json({ msg: "médico não cadastrado!" })

    //     const ubsExiste = await Ubs.findById(id_ubs)

    //     if(!ubsExiste)
    //         return res.status(422).json({ msg: "ubs não cadastrado!" })

    //     const consulta = new Consulta({
    //         horario,
    //         data,
    //         tipo: medicoExiste.tipo,
    //         id_medico,
    //         id_ubs,
    //     })

    //     try {
    //         await consulta.save()
    //         res.status(200).json({ msg: "inserido na tabela consulta com sucesso" })
    //     } catch (error) {
    //         res.status(400).json({ msg: 'Erro ao adicionar na tabela consulta' })
    //     }
    // }
    async createQuery(req, res) {
        const { consultas } = req.body;
    
        if (!consultas || !Array.isArray(consultas) || consultas.length === 0) {
            return res.status(422).json({ msg: "Nenhuma consulta fornecida!" });
        }
    
        const consultasParaInserir = [];
    
        for (const consultaInfo of consultas) {
            const { horario, data, id_medico, id_ubs } = consultaInfo;
            const reverseDate = data.split("-").reverse().join("-")
            const insertDate = `${reverseDate} ${horario} UTC-03:00`
    
            if (!horario || !data || !id_medico || !id_ubs) {
                return res.status(422).json({ msg: "Todos os campos da consulta são obrigatórios!" });
            }
    
            const consultaExiste = await Consulta.findOne({ data: new Date(insertDate), id_ubs, id_medico });
    
            if (consultaExiste) {
                return res.status(422).json({ msg: "Choque de horario!" });
            }
    
            const medicoExiste = await Medico.findById(id_medico);
    
            if (!medicoExiste) {
                return res.status(422).json({ msg: "Médico não cadastrado!" });
            }
    
            const ubsExiste = await Ubs.findById(id_ubs);
    
            if (!ubsExiste) {
                return res.status(422).json({ msg: "UBS não cadastrada!" });
            }
    
            const consulta = new Consulta({
                data: new Date(insertDate),
                tipo: medicoExiste.especialidade,
                id_medico,
                id_ubs,
            });
            
            consultasParaInserir.push(consulta);
        }
    
        try {
            const result = await Consulta.insertMany(consultasParaInserir);
            res.status(200).json({ msg: "Consultas inseridas com sucesso", result });
        } catch (error) {
            console.log(error);
            res.status(400).json({ msg: 'Erro ao adicionar consultas', error });
        }
    }
    // async createQuery(req, res) {
    //     const { consultas } = req.body;
    
    //     if (!consultas || !Array.isArray(consultas) || consultas.length === 0) {
    //         return res.status(422).json({ msg: "Nenhuma consulta fornecida!" });
    //     }
    
    //     const consultasParaInserir = [];
    
    //     for (const consultaInfo of consultas) {
    //         const { horario, data, id_medico, id_ubs } = consultaInfo;
    
    //         if (!horario || !data || !id_medico || !id_ubs) {
    //             return res.status(422).json({ msg: "Todos os campos da consulta são obrigatórios!" });
    //         }
    
    //         const consultaExiste = await Consulta.findOne({ horario, data, id_ubs, id_medico });
    
    //         if (consultaExiste) {
    //             return res.status(422).json({ msg: "Choque de horario!" });
    //         }
    
    //         const medicoExiste = await Medico.findById(id_medico);
    
    //         if (!medicoExiste) {
    //             return res.status(422).json({ msg: "Médico não cadastrado!" });
    //         }
    
    //         const ubsExiste = await Ubs.findById(id_ubs);
    
    //         if (!ubsExiste) {
    //             return res.status(422).json({ msg: "UBS não cadastrada!" });
    //         }
    
    //         const consulta = {
    //             horario,
    //             data,
    //             tipo: medicoExiste.especialidade,
    //             id_medico,
    //             id_ubs,
    //         };
            
    //         consultasParaInserir.push(consulta);
    //     }
    
    //     try {
    //         const result = await Consulta.insertMany(consultasParaInserir);
    //         res.status(200).json({ msg: "Consultas inseridas com sucesso", result });
    //     } catch (error) {
    //         res.status(400).json({ msg: 'Erro ao adicionar consultas', error });
    //     }
    // }
    
}
