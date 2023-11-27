import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/connection.js';
import bcrypt from 'bcrypt';

class User extends Model {
    // login verification
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password)
    }

    // search
    getLowerCaseName() {
        return this.username.toLowerCase();
    }
};

User.init(
    // data fields
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        profilePic: {
            type: DataTypes.STRING,
            defaultValue: 'https://res.cloudinary.com/dp6owwg93/image/upload/v1700111110/kh175ecm7lhercovte8p.png'
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { len: [8] }
        },
        relationshipStatus: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'N/A'
        },
        school: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'N/A',
            validate: { len: [0, 30] }
        },
        work: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'N/A',
            validate: { len: [0, 30] }
        },
        currentlyLearning: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'N/A',
            validate: { len: [0, 20] }
        },
        headline: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'Add a headline!',
            validate: { len: [0, 100] }
        },
        petPeeve: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'N/A',
            validate: { len: [0, 28] }
        },
        website: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        hobbies: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'N/A',
            validate: { len: [0, 30] }
        }
    },
    // OPTIONS / CONFIG
    {
        hooks: {
            beforeCreate: async (newUserData) => {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            beforeUpdate: async (updatedUserData) => {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        sequelize,
        // doesn't plurarlize table name
        freezeTableName: true,
        modelName: 'User',
    }
)

export default User;






