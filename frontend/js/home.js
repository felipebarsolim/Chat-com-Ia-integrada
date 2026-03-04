import { id } from "./validate_home.js";

let socket;

const newUser = async () => {
    const userId = id;
    const request = await fetch("http://localhost:9092/user-name", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
    });

    const { name } = await request.json();

    return name;
};

const renderAlertNewUser = (name) => {
    const content = document.querySelector(".content");
    const boxAlert = document.createElement("div");
    boxAlert.classList.add("new-user");
    boxAlert.innerText = `${name} joined the chat`;
    content.appendChild(boxAlert);
    scrollToBottom();
};

const webSocketConnection = () => {
    socket = new WebSocket("ws://localhost:9093");

    socket.onopen = async (event) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const request = await fetch("http://localhost:9092/messages", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (request.ok) {
                const history = await request.json();

                history.forEach((element) => {
                    const { userId, name, content } = element;
                    renderMesseges(userId, name, content);
                });

                const name = await newUser();
                renderAlertNewUser(name);

                const messageSocket = JSON.stringify({
                    type: "alert",
                    data: name,
                });
                socket.send(messageSocket);
            }
        }
    };

    socket.onmessage = ({ data }) => {
        const payload = JSON.parse(data);
        if (payload.type === "alert") {
            renderAlertNewUser(payload.userName);
        } else {
            const { userId, name, content } = JSON.parse(data);
            if (userId !== id) {
                renderOtherMessages(name, content);
                scrollToBottom();
            } else {
                renderOwnerMesseges(content);
                scrollToBottom();
            }
        }
    };
};

const scrollToBottom = () => {
    const contents = document.querySelector(".content");

    if (contents) {
        const contents = document.querySelector(".content");
        contents.scrollTop = contents.scrollHeight;
    }
};

const renderOwnerMesseges = (content) => {
    const contents = document.querySelector(".content");

    const boxMessage = document.createElement("div");
    boxMessage.classList.add("own-message");
    const user = document.createElement("div");
    user.classList.add("user-owner");
    user.innerText = "You";
    boxMessage.appendChild(user);
    const text = document.createElement("p");
    text.classList.add("text");
    text.innerText = content;
    boxMessage.appendChild(text);

    contents.appendChild(boxMessage);
};

const renderOtherMessages = (name, content) => {
    const contents = document.querySelector(".content");

    const boxMessage = document.createElement("div");
    boxMessage.classList.add("other-message");
    const user = document.createElement("div");
    user.classList.add("other-user");
    user.innerText = name;
    boxMessage.appendChild(user);
    const text = document.createElement("p");
    text.classList.add("text");
    text.innerText = content;
    boxMessage.appendChild(text);

    contents.appendChild(boxMessage);
};

const renderMesseges = (userID, name, content) => {
    if (userID === id) {
        renderOwnerMesseges(content);
        scrollToBottom();
    } else {
        renderOtherMessages(name, content);
        scrollToBottom();
    }
};

const sendMessege = (e) => {
    e.preventDefault();

    const inputContent = document.querySelector("#message");
    const content = inputContent.value;
    const userId = id;

    const message = {
        userId,
        content,
    };

    socket.send(JSON.stringify(message));

    renderMesseges(userId, "You", content);
    inputContent.value = "";
    inputContent.focus();
};

document.querySelector("#form").addEventListener("submit", sendMessege);

webSocketConnection();
