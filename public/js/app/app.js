import {registerApi,loginApi,logoutApi,getProfileApi,editProfileApi} from "../api/users.js"


async function loadHeader() {
    const response = await fetch('templates/header.html'), header = await response.text();
    document.getElementById('header').innerHTML = header;
}

async function loadLogin(){
    const response = await fetch('templates/login.html'), modalLogin = await response.text();
    document.body.insertAdjacentHTML('beforeend', modalLogin);
}

async function loginFront(errorDisplay){

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const data = await loginApi(email, password);
        console.log("Авторизация успешна:", data);
        document.getElementById("login-modal").style.display = "none"
        const loginButton = document.getElementById("login-button");
        if (loginButton) {
            loginButton.style.display = "none";
        }

        const userMenu = document.getElementById("user-menu");
        const userEmail = document.getElementById("user-email");
        if (userMenu && userEmail) {
            const userData = await getProfileApi()
            userMenu.style.display = "block";
            userEmail.textContent = userData.email;
        }

    } catch (error) {
        console.error("Ошибка авторизации:", error.message);
        errorDisplay.textContent = error.message;
        errorDisplay.style.display = "block";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadHeader();

    // логика поведения модального окна
    loadLogin().then(() => {
        document.getElementById("login-button").addEventListener("click", function (event) {
            event.preventDefault();
            document.getElementById("login-modal").style.display = "block";
        });

        window.addEventListener("click", function (event) {
            const modal = document.getElementById("login-modal");
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });

        // логика авторизации
        const loginForm = document.getElementById("login-form");
        const errorDisplay = document.getElementById("login-error");
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            await loginFront(errorDisplay)
        });
    });
});
