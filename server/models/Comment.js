import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/connection.js';

class Comment extends Model {};

Comment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        commentText: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            }
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Post',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        // doesn't plurarlize table name
        freezeTableName: true,
        modelName: 'Comment',   
    }
)

export default Comment;