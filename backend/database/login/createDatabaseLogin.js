import { sequelize } from "./connection.js";
import { Sequelize } from "sequelize";

const newDatabaseLogin = sequelize.define("users", {
    name: {
        type: Sequelize.STRING,
    },
    user: {
        type: Sequelize.STRING,
    },
    password: {
        type: Sequelize.STRING,
    },
});

const createTableLogin = async () => {
    try {
        await newDatabaseLogin.sync();
    } catch (error) {
        console.log("ERROR in newDatabaseLogin: " + error);
    }
};

export { newDatabaseLogin, createTableLogin };
