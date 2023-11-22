const { Model, DataTypes } = require("sequelize");
const db = require("../config/db");
const Endereco = require("./endereco.model");

class Paciente extends Model {}

Paciente.init(
  {
    id_paciente: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sobrenome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data_nasc: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    numero_sus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "paciente",
    timestamps: false,
  }
);

Paciente.belongsTo(Endereco, { foreignKey: "id_endereco" });

module.exports = Paciente;
