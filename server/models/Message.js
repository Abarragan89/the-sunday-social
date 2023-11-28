const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection');


class Message extends Model {};

Message.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        messageText: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sender: {
            type: DataTypes.STRING(25),
            allowNull: false,
        },
        chatroomId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'ChatRoom',
                key: 'id'
            }
        }
    }, 
    {
        sequelize,
        // doesn't plurarlize table name
        freezeTableName: true,
        modelName: 'Message',   
    }
)

module.exports = { Message }