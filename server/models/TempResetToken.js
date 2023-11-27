const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection');


class TempResetToken extends Model {};

TempResetToken.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            }
        },
        tokenId: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, 
    {
        sequelize,
        // doesn't plurarlize table name
        freezeTableName: true,
        modelName: 'TempResetToken',   
    }
)

module.exports = { TempResetToken }