const { Model, DataTypes } = require("sequelize");
const db = require("../config/db");
const Paciente = require("./paciente.model");
const Medico = require("./medico.model");

class Consulta extends Model {}

Consulta.init(
  {
    id_consulta: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    horario: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    data: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "consulta",
    timestamps: false,
  }
);

Consulta.belongsTo(Paciente, { foreignKey: "id_paciente" });
Consulta.belongsTo(Medico, { foreignKey: "id_medico" });

module.exports = Consulta;
