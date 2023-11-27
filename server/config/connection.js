import Sequelize from 'sequelize';

import 'dotenv/config'

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    port: 3306
  }
);

export default sequelize;