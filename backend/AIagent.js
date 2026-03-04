import { OpenAI } from "openai/client.js";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const agentAiResponse = async (input) => {
    const response = await client.responses.create({
        model: "gpt-5-nano",
        input,
    });

    return response;
};

export default agentAiResponse;
