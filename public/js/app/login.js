import {loginApi} from "../api/users.js";
import {rendering} from "./router.js";

export function initializeLoginPage() {
    const authForm = document.getElementById("auth-form");

    if (!authForm) {
        return;
    }

    authForm.querySelector("#register").addEventListener("click", (event) => {
        event.preventDefault();
        history.pushState(null, null, "/registration");
        rendering();
    });

    authForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const data = await loginApi(email, password);
            if (data.token) {
                window.location.href = "/";
            }
        } catch (error) {
            alert("Неверный логин или пароль");
        }
    });
}