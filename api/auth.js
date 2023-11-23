const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Paciente = require("../model/Paciente")
const Endereco = require("../model/Endereco")
const Ubs = require("../model/Ubs")
require("dotenv").config()


module.exports = {
    async registerUser(req, res) {
        const { nome, email, senha, sobrenome, cpf, data_nasc, numero_sus, confirmarSenha, cep, rua, bairro, cidade, estado, numero } = req.body

        if (!nome)
            return res.status(422).json({ msg: "O nome é obrigatório!" })

        if(!sobrenome)
            return res.status(422).json({ msg: "O sobrenome é obrigatório!" })  
        
        if(!cpf)
            return res.status(422).json({ msg: "O CPF é obrigatório!" })

        if(!data_nasc)
            return res.status(422).json({ msg: "A data de nascimento é obrigatório!" })

        if(!numero_sus)
            return res.status(422).json({ msg: "O numero do SUS é obrigatório!" })

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

        if (!email)
        return res.status(422).json({ msg: "O email é obrigatório!" })

        if (!senha)
            return res.status(422).json({ msg: "A senha é obrigatório!" })

        if(senha !== confirmarSenha)
            return res.status(422).json({ msg: "A senha não confere!" }) 

        const pacienteExiste = await Paciente.findOne({email})

        if(pacienteExiste)
            return res.status(422).json({ msg: "Conta existente!"})

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
        const reverseDate = data_nasc.split("-").reverse().join("-")
        const insertDate = `${reverseDate}`

        const paciente = new Paciente({
            nome,
            email,
            senha: passWordHash,
            sobrenome,
            cpf,
            data_nasc: new Date(insertDate),
            numero_sus,
            id_endereco: endereco.id,
            admin: false
        })

        try {
            await paciente.save()
            res.status(200).json({ msg: "Cadastrado com sucesso!"})
        } catch (error) {
            res.status(400).json({ msg: 'Erro ao tentar cadastrar!'})
        }
    },

    async loginUser(req, res) {
        const { email, senha } = req.body

        if (!email)
            return res.status(422).json({ msg: "O email é obrigatório!!" })

        if (!senha){
            return res.status(422).json({ msg: "A senha é obrigatório!!" })
        }

        const paciente = await Paciente.findOne({email})
        const ubs = await Ubs.findOne({ usuario: email })

        const user = paciente ? paciente : ubs

        if(!user)
            return res.status(401).json({ msg: "Conta não encontrada!" })

        const checarSenha = await bcrypt.compare(senha, user.senha)

        if(!checarSenha)
            return res.status(401).json({ msg: "Email/senha incorretos!" })

       try {
            
            const secret = process.env.SECRET

            const token = jwt.sign({
                id: user.id,
                admin: user.admin
            },
            secret,
            )

            res.status(200).json({ msg: "Autenticação realizada com sucesso!!",  token: token, id: user.id, admin: user.admin })
       } catch (error) {
            res.status(400).json({ msg: 'Erro com o servidor, tente novamente mais tarde'})
       }
    },

    async checkToken(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader

        if(!token) 
            res.status(401).json({ msg: 'Acesso negado!!' })

        try {
            const secret = process.env.SECRET

            await jwt.verify(token, secret)

            next()
        } catch (error) {
            res.status(400).json({ msg: 'Token invalido!!' })
        }
    },

    async checkAdmin(req, res, next) {
        const authHeader = req.headers['authorization']
        const tokenExiste = authHeader
        if(!tokenExiste) 
            return res.status(401).json({ msg: 'Acesso negado!!' })

        try {
            const secret = process.env.SECRET

            const token = await jwt.decode(tokenExiste, secret)

            if (!token.admin)
                return res.status(401).send({msg: "Acesso negado!", validate: false })

            next()
        } catch (error) {
            res.status(401).json({ msg: 'Token invalido!!', validate: false })
        }
    },

    async validateToken(req, res) {
        const authHeader = req.headers['authorization']
        const token = authHeader
        
        if(!token) 
            return res.status(401).json({ msg: 'Acesso negado!!' })
    
        try {
            const secret = process.env.SECRET
        
            await jwt.verify(token, secret)
        
            res.status(200).json({ msg: 'Acesso liberado!!', validate: true })
        } catch (error) {
            res.status(401).json({ msg: 'Token invalido!!', validate: false })
        }
    },

    async validateAdmin(req, res) {
        const authHeader = req.headers['authorization']
        const tokenExiste = authHeader
        if(!tokenExiste) 
            return res.status(401).json({ msg: 'Acesso negado!!' })

        try {
            const secret = process.env.SECRET

            const token = await jwt.decode(tokenExiste, secret)

            if (!token.admin)
                return res.status(401).send({msg: "Acesso negado!", validate: false })

            res.status(201).send({ msg: "Acesso liberado!", validate: true })
        } catch (error) {
            res.status(401).json({ msg: 'Token invalido!!', validate: false })
        }
    }
}