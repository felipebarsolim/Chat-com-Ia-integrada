const validateLogin = async (user, password) => {
    const account = {
        user: user,
        password: password,
    };

    const request = await fetch("http://localhost:9092/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(account),
    });

    const response = await request.json();

    const { sucess, accessToken } = response;

    if (sucess) {
        localStorage.setItem("accessToken", accessToken);
        location.href = "http://localhost:9092/home";
    } else {
        alert("User or password incorrect");
        document.querySelector(".camps").classList.toggle("incorrect");
    }
};

const newUser = () => {
    location.href = "http://localhost:9092/sign_up";
};

const loginUser = async (e) => {
    e.preventDefault();

    const userEmail = document.querySelector("#user-email").value;
    const password = document.querySelector("#password").value;

    await validateLogin(userEmail, password);
};

const user = document
    .querySelector("#form")
    .addEventListener("submit", loginUser);

const signUp = document
    .querySelector("#signup")
    .addEventListener("click", newUser);
