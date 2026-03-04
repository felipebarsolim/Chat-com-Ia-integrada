import { WebSocketServer } from "ws";
import newMessege from "./database/chat/newmessege.js";
import agentAiResponse from "./AIagent.js";
import { newDatabaseLogin } from "./database/login/createDatabaseLogin.js";

const startWebSocket = () => {
    try {
        const port = process.env.WEB_SOCKET_PORT;
        const ws = new WebSocketServer({ port: port || 9093 });
        console.log("Server connected to Websocket");

        const websocket = (ws) => {
            ws.on("connection", (connection) => {
                console.log("new connection started");

                connection.on("error", (error) => {
                    console.log("ERROR ws, " + error);
                });

                connection.on("message", async (message) => {
                    try {
                        const payload = JSON.parse(message);

                        if (payload.type) {
                            const name = payload.data;
                            ws.clients.forEach((element) => {
                                if (
                                    element.readyState === 1 &&
                                    element !== connection
                                ) {
                                    element.send(
                                        JSON.stringify({
                                            type: "alert",
                                            userName: name,
                                        }),
                                    );
                                }
                            });
                        } else {
                            const { userId, content } = payload;
                            const user = await newDatabaseLogin.findOne({
                                where: {
                                    id: userId,
                                },
                            });

                            const name = user.dataValues.name;

                            await newMessege(content, name, userId, "1");

                            const newMessagePayload = JSON.stringify({
                                userId,
                                content,
                                name,
                            });

                            ws.clients.forEach((client) => {
                                if (
                                    client.readyState === 1 &&
                                    client !== connection
                                ) {
                                    client.send(newMessagePayload);
                                }
                            });

                            const contentLower = content.toLowerCase();

                            if (contentLower.includes("@bot")) {
                                const input = content
                                    .replace("@bot", "")
                                    .trim();
                                const question = `o usuario ${name} disse:${input}`;

                                const nameAi = "Bot OpenAI";
                                const userIdAi = 0;

                                if (input.length > 0) {
                                    const responseAi =
                                        await agentAiResponse(question);
                                    const messageAi = {
                                        userId: userIdAi,
                                        name: nameAi,
                                        content: responseAi.output_text,
                                    };

                                    await newMessege(
                                        responseAi.output_text,
                                        nameAi,
                                        userIdAi,
                                        "1",
                                    );

                                    ws.clients.forEach((client) => {
                                        client.send(JSON.stringify(messageAi));
                                    });
                                }
                            }
                        }
                    } catch (error) {
                        console.log("ERROR in connection on message, " + error);
                    }
                });

                connection.on("close", (reasonCode, description) => {
                    console.log("user logout");
                });
            });
        };

        websocket(ws);
    } catch (error) {
        console.log("ERROR in websocket connection, " + error);
    }
};

export { startWebSocket };
