const Sequelize = require ("sequelize");

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './projetoSaude.sqlite'
});

module.exports = sequelize;