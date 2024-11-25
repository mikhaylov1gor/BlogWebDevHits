import {editProfileApi, getProfileApi} from "../api/users.js";
import {rendering} from "./router.js";

export async function initializeProfilePage() {
    const authForm = document.getElementById("auth-form");

    if (!authForm) {
        return;
    }

    try {
        const userData = await getProfileApi();

        authForm.querySelector("#email").value = userData.email;
        authForm.querySelector("#name").value = userData.fullName;
        authForm.querySelector("#birthDate").value = new Date(userData.birthDate).toISOString().split("T")[0]
        authForm.querySelector("#gender").value = userData.gender === "Male" ? "Мужчина" : "Женщина"
        authForm.querySelector("#phone").value = userData.phoneNumber;

    } catch (error) {
        console.error("Ошибка при загрузке данных профиля:", error.message);
    }

    document.getElementById("save").addEventListener("click", async () => {
        try {
            const email = authForm.querySelector("#email").value;
            const name = authForm.querySelector("#name").value;
            const birthDate = authForm.querySelector("#birthDate").value;
            const gender = authForm.querySelector("#gender").value;
            const phone = authForm.querySelector("#phone").value;

            await editProfileApi(email, name, birthDate, gender, phone)
            rendering();
        } catch (error) {
            console.error("Ошибка при сохранении данных профиля:", error.message);
        }
    });

}