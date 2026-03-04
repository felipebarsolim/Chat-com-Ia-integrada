import { newDatabaseLogin } from "./createDatabaseLogin.js";
import jsonwebtoken from "jsonwebtoken";

const logIn = async (user, password) => {
    //user includes in database?
    try {
        const databaseLogin = await newDatabaseLogin.findAll();

        const validate = databaseLogin.find(
            (element) =>
                element.dataValues.user === user &&
                element.dataValues.password === password,
        );

        if (validate) {
            console.log(`user ${user} access!`);
            //create an access token

            const id = validate.dataValues.id; //mudei aqui

            const secretKey = process.env.SECRET_KEY;

            const token = jsonwebtoken.sign(id, secretKey);

            return token;
        } else {
            console.log(`access denied user ${user}`);
            return false;
        }
    } catch (error) {
        console.log("ERROR in login, " + error);
    }
};

export default logIn;
