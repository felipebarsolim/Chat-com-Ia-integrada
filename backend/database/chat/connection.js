import { Sequelize } from "sequelize";

const host = process.env.HOST_CHAT;
const dialect = process.env.DIALECT_CHAT;

const sequelize = new Sequelize(process.env.MYSQL_URL_CHAT, {
    host,
    dialect,
    logging: false,
});

const chatDatabaseConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Server connected to chat database");
    } catch (error) {
        console.log("ERROR in chat database connection, " + error);
    }
};

export { chatDatabaseConnection, sequelize };
