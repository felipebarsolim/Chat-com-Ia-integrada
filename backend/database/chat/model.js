import { sequelize } from "./connection.js";
import { Sequelize } from "sequelize";

const messeges = sequelize.define("message_content", {
    content: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    chatId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

const syncMessegeModel = async () => {
    try {
        await messeges.sync();
    } catch (error) {
        console.log("ERROR in sync messege model, " + error);
    }
};

export { messeges, syncMessegeModel };
