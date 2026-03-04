import { messeges } from "./model.js";

const newMessege = async (content, name, userId, chatId) => {
    try {
        messeges.create({
            content,
            name,
            userId,
            chatId,
        });

        console.log("message created");
    } catch (error) {
        console.log(error);
        return error;
    }
};

export default newMessege;
