const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection');


class ChatRoom extends Model {};

ChatRoom.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        chatRoomName: {
            type: DataTypes.STRING,
            defaultValue: 'Message',
        },
        notifications: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isGroupChat: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        // i just switch this field when a message is sent to update the update time
        updateBoolean: {
            type: DataTypes.STRING,
            defaultValue: false,
        }
    }, 
    {
        sequelize,
        // doesn't plurarlize table name
        freezeTableName: true,
        modelName: 'ChatRoom',   
    }
)

module.exports = { ChatRoom }