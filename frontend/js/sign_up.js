const signUp = async (e) => {
    e.preventDefault();

    const name = document.querySelector("#name").value;
    const user = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    const newAccount = {
        name,
        user,
        password,
    };

    const request = await fetch("http://localhost:9092/sign_up", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newAccount),
    });

    const response = await request.json();

    const { sucess } = response;

    if (sucess) {
        location.href = "http://localhost:9092/login";
    } else {
        alert("User Already Signed up");
    }
};

document.querySelector("#form").addEventListener("submit", signUp);
