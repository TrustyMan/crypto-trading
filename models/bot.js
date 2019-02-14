'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bot = sequelize.define('Bot', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING,
    licensekey: DataTypes.STRING,
    apikey: DataTypes.STRING,
    symbol: DataTypes.STRING,
    actualprice: DataTypes.STRING,
    entryprice: DataTypes.STRING,
    increase: DataTypes.STRING,
    amountinvested: DataTypes.STRING,
    equivalent: DataTypes.STRING,
    tradingtime: DataTypes.STRING,
    arrivaltime: DataTypes.STRING,
    salesprice: DataTypes.STRING,
    presaleprice: DataTypes.STRING,
    gain: DataTypes.STRING
  },  {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
    // don't delete database entries but set the newly added attribute deletedAt
    // to the current date (when deletion was done). paranoid will only work if
    // timestamps are enabled
    paranoid: true,
    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: true,
    // disable the modification of tablenames; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,
    // define the table's name
    tableName: 'tbl_bots_list'
  })
  Bot.associate = (models) => {
    // associations can be defined here
    models.Bot.belongsTo(models.Symbol, {
      onDelete: "CASCADE",
      foreignKey: {
        name: 'symbol',
        allowNull: false
      }
    })
    models.Bot.belongsTo(models.key, {
      onDelete: "CASCADE",
      foreignKey: {
        name: 'apikey',
        allowNull: false
      }
    })
  }
  return Bot;
}