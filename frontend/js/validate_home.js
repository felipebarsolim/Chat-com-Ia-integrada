const validateAcessHome = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken === null) {
        location.href = "http://localhost:9092/login";
    } else {
        try {
            const request = await fetch(
                "http://localhost:9092/login/validate",
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );

            const response = await request.json();
            const { id } = response;
            //possivel falha se segurança: se mudar o sucess pra true no frontend,
            //a pagina login será acessada

            if (!request.ok) {
                alert("Access denied");
                location.href = "http://localhost:9092/login";
                return null;
            }

            return id;
        } catch (error) {
            console.log("ERROR in acess home, " + error);
        }
    }
};

const id = await validateAcessHome();

export { id };
