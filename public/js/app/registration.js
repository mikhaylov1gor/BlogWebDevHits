import {rendering} from "./router.js";
import {registerApi} from "../api/users.js";

export function initializeRegistrationPage() {
    const authForm = document.getElementById("auth-form");

    if (!authForm) {
        return;
    }

    authForm.querySelector("#register").addEventListener("click", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const birthDate = document.getElementById("birthDate").value;
        const gender = document.getElementById("gender").value;
        const phone = document.getElementById("phone").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const data = await registerApi({ name, birthDate, gender, phone, email, password });
            history.pushState(null, null, "/profile");
            rendering();
        } catch (error) {
            alert("Ошибка регистрации: " + error.message);
        }
    });
}