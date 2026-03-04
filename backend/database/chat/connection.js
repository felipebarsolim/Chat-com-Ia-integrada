import { Sequelize } from "sequelize";

const password = process.env.DATABASE_CHAT_PASSWORD;
const databaseName = process.env.DATABASE_CHAT_NAME;
const host = process.env.HOST_CHAT;
const dialect = process.env.DIALECT_CHAT;
const user = process.env.USER_CHAT;
const port = process.env.DATABASE_CHAT_PORT;

const sequelize = new Sequelize(databaseName, user, password, {
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
