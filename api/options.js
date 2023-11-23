const Consulta = require('../model/Consulta')
const Ubs = require('../model/Ubs')
const Medico = require('../model/Medico')

function filterRepetitiveOptions(data) {
    let newArray = [];

    data.forEach(obj => {
        if (!newArray.includes(obj.tipo)) {
            newArray.push(obj.tipo);
        }
    });

    return newArray;
}

module.exports = {
    async loadOptions(req, res){
        const id = req.params.id
        console.log(id);
        try {
            const consulta = id ? await Consulta.find({id_ubs: id}, 'tipo') : await Consulta.find({}, 'tipo')
            const ubs = await Ubs.find({}, 'nome')
            const medico = id ? await Medico.find({id_ubs: id}, 'nome especialidade') : await Medico.find({}, 'nome especialidade')
            const tipo = filterRepetitiveOptions(consulta)
            const response = {
                tipoConsulta: tipo,
                nomeUbs: ubs,
                medico: medico
            }
            res.status(200).json(response)
        } catch (error) {
            console.log(error);
            res.status(400).json({ msg: 'Erro na consulta'})
        } 
    },
}