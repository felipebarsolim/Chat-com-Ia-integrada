import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.USER,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.HOST,
        dialect: process.env.DIALECT,
        port: process.env.DATABASE_PORT,
        logging: false,
    },
);

const connectionLoginDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("Server connected to login database");
    } catch (error) {
        console.log("ERROR login database, " + error);
    }
};

export { connectionLoginDatabase };
export { sequelize };
