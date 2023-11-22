const { Model, DataTypes } = require("sequelize");
const db = require("../config/db");
const Ubs = require("./ubs.model");

class Medico extends Model {}

Medico.init(
  {
    id_medico: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    crm: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    especialidade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "medico",
    timestamps: false,
  }
);

Medico.belongsTo(Ubs, { foreignKey: "id_ubs" });

module.exports = Medico;
