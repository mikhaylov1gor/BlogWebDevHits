import {registerApi} from "../api/users.js";
import {validation} from "./app.js";


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

        if (!validation(phone,"phone")){
            alert("некорректный номер телефона");
            return;
        }
        try {
            const formattedBirthDate = new Date(birthDate).toLocaleDateString('ru-RU').split('.').reverse().join('-')
            await registerApi(name, password, email, formattedBirthDate, gender, phone);
        } catch (error) {
            alert("Ошибка регистрации: " + error.message);
        }
    });
}