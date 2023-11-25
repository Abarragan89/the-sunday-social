const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection');


class UserChatJunc extends Model {};

UserChatJunc.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        chatRoomId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'ChatRoom',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            }
        },
        isGroupChat: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        notifications: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        }
    }, 
    {
        sequelize,
        // doesn't plurarlize table name
        freezeTableName: true,
        modelName: 'UserChatJunc',   
    }
)

module.exports = { UserChatJunc }