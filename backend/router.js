import express from "express";
import createNewUser from "./database/login/createNewUser.js";
import logIn from "./database/login/login.js";
import path from "path";
import { fileURLToPath } from "url";
import jsonwebtoken from "jsonwebtoken";
import { newDatabaseLogin } from "./database/login/createDatabaseLogin.js";
import { messeges } from "./database/chat/model.js";

const __filename = fileURLToPath(import.meta.url); //get url type of file and convert to pure url
const __dirname = path.dirname(__filename);

const router = express.Router();

router.post("/sign_up", async (req, res) => {
    try {
        const { name, user, password } = req.body;

        if (name && user && password) {
            const validate = await createNewUser(name, user, password);

            if (validate) {
                return res.status(201).json({ sucess: true }); //create
            } else {
                return res.status(409).json({ sucess: false }); //already sign in
            }
        } else {
            console.log("ERROR in create user");
            return res.status(409).json({ sucess: false });
        }
    } catch (error) {
        console.log("ERROR in http request post new user, " + error);
    }
});

router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "html", "index.html"));
    console.log("Someone access login page");
});

const validateAcessToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(403).json({ sucess: false });

    jsonwebtoken.verify(token, process.env.SECRET_KEY, async (error, id) => {
        if (error) {
            console.log(error);
            return res.status(403).json({ sucess: false });
        } else {
            const user = await newDatabaseLogin.findOne({
                where: {
                    id,
                },
            });

            req.userId = user.dataValues.id;
            next();
        }
    });
};

router.get("/login/validate", validateAcessToken, (req, res) => {
    const id = req.userId;
    res.status(200).json({ sucess: true, id });
});

router.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "html", "home.html"));
});

router.get("/sign_up", (req, res) => {
    res.sendFile(
        path.join(__dirname, "..", "frontend", "html", "sign_up.html"),
    );
});

router.post("/login", async (req, res) => {
    try {
        const { user, password } = req.body;

        const accessToken = await logIn(user, password);

        if (accessToken) {
            return res.status(200).json({
                sucess: true,
                accessToken,
            });
        } else {
            return res.status(409).json({
                sucess: false,
            });
        }
    } catch (error) {
        console.log("ERROR in http request get login, " + error);
    }
});

router.get("/messages", validateAcessToken, async (req, res) => {
    const messagesHistory = await messeges.findAll();
    const packageMessages = [];
    messagesHistory.forEach((element) => {
        const { dataValues } = element;
        packageMessages.push(dataValues);
    });
    res.status(200).json(packageMessages);
});

router.post("/user-name", async (req, res) => {
    const { userId } = req.body;
    const user = await newDatabaseLogin.findOne({
        where: {
            id: userId,
        },
    });
    if (user) {
        const name = user.dataValues.name;
        if (name) {
            res.status(200).json({ name });
        }
    } else {
        res.status(403);
    }
});

export default router;
