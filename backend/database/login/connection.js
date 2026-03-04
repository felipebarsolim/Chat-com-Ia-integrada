import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.MYSQL_URL, {
    dialect: process.env.DIALECT,
    port: process.env.DATABASE_PORT,
});

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
