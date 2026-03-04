import "dotenv/config";
import express from "express";
import { connectionLoginDatabase } from "./database/login/connection.js";
import { createTableLogin } from "./database/login/createDatabaseLogin.js";
import router from "./router.js";
import path from "path";
import { fileURLToPath } from "url";
import { chatDatabaseConnection } from "./database/chat/connection.js";
import { syncMessegeModel } from "./database/chat/model.js";
import { startWebSocket } from "./websocket.js";

const __filename = fileURLToPath(import.meta.url); //get url type of file and convert to pure url
const __dirname = path.dirname(__filename);

const app = express(); //express's instances

const startServer = async () => {
    try {
        await connectionLoginDatabase();
        await chatDatabaseConnection();

        await createTableLogin();
        await syncMessegeModel();

        app.use(express.json());

        app.use(express.static(path.join(__dirname, "..", "frontend")));

        app.use("/", router);

        startWebSocket();

        app.listen(process.env.PORT, () => {
            console.log(`Server online in ${process.env.PORT} port`);
        });
    } catch (error) {
        console.log("ERROR start server, " + error);
    }
};

startServer();
