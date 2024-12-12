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
        const formattedBirthDate = new Date(birthDate).toLocaleDateString('ru-RU').split('.').reverse().join('-')

        if (!validation(phone,"phone")){
            alert("некорректный номер телефона");
            return;
        }

        if (!validation(password, "password")){
            alert("пароль должен содержать хотя бы одну цифру и иметь длину больше 5");
            return;
        }


        try {
            await registerApi(name, password, email, formattedBirthDate, gender, phone);
        } catch (error) {
            alert("Ошибка регистрации: " + error.message);
        }
    });
}