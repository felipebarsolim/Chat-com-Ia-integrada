import { newDatabaseLogin } from "./createDatabaseLogin.js";

const createNewUser = async (name, user, password) => {
    //aqui tem uma  falha de segurança: Estou confiando nesses dados que vem do frontend
    //propricio a um SQL injection

    const users = await newDatabaseLogin.findAll();

    const validation = users.find(
        (element) => element.dataValues.user === user,
    );

    if (!validation) {
        try {
            await newDatabaseLogin.create({
                name: name,
                user: user,
                password: password,
            });

            console.log("user created!");

            return true;
        } catch (error) {
            console.log("ERROR to create new user: " + error);
        }
    } else {
        console.log(`user ${user} already sign in!`);

        return false;
    }
};

export default createNewUser;
