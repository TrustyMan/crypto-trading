'use strict';
module.exports = (sequelize, DataTypes) => {
  const key = sequelize.define('key', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING,
    exchangehouse: DataTypes.STRING,
    licensekey: DataTypes.STRING,
    apikey: DataTypes.STRING,
    secretkey: DataTypes.STRING
  }, {
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
    tableName: 'tbl_keys_list'
  })
  key.associate = function(models) {
    // associations can be defined here
    // models.key.belongsToMany(through: 'Bot', foreignKey: 'id')
  }
  return key
}