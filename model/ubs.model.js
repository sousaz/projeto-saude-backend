const { Model, DataTypes } = require("sequelize");
const db = require("../config/db");
const Endereco = require("./endereco.model");

class Ubs extends Model {}

Ubs.init(
  {
    id_ubs: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "ubs",
    timestamps: false,
  }
);

Ubs.belongsTo(Endereco, { foreignKey: "id_endereco" });

module.exports = Ubs;
