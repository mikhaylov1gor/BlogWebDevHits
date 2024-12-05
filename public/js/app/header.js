import {getProfileApi, logoutApi} from "../api/users.js";
import {navigateTo} from "./router.js";

export const loadHeader = async() =>{
    try {
        const response = await fetch("/templates/header.html");
        if (!response.ok) {
            throw new Error(`Не удалось загрузить header: ${response.statusText}`);
        }

        document.querySelector('header').innerHTML = await response.text();
        const token = localStorage.getItem("authToken");

        if(token){
            const userMenu = document.getElementById("user-menu");
            const userEmail = document.getElementById("user-email");
            const dropdownMenu = document.getElementById("dropdown-menu");
            const logoutButton = document.getElementById("logout-button");
            const loginButton = document.getElementById("login-button");
            const profileButton = document.getElementById("profile-button")
            document.getElementById("communities-link").style.display = "compact";
            document.getElementById("authors-link").style.display ="compact";

            if(window.location.pathname === "/profile"){
                document.getElementById("create-post-link").style.display = "inline";
                document.getElementById("authors-link").style.display = "none";
                document.getElementById("communities-link").style.display = "none";
            }
            else{
                document.getElementById("create-post-link").style.display = "none";
                document.getElementById("authors-link").style.display = "inline";
                document.getElementById("communities-link").style.display = "inline";
            }
            if (userMenu && userEmail) {
                const userData = await getProfileApi()
                userMenu.style.display = "block";
                userEmail.textContent = userData.email;
            }
            userEmail.addEventListener("click", () => {
                const isMenuVisible = dropdownMenu.style.display === "block";
                dropdownMenu.style.display = isMenuVisible ? "none" : "block";
            });

            document.addEventListener("click", (event) => {
                if (!dropdownMenu.contains(event.target) && !userEmail.contains(event.target)) {
                    dropdownMenu.style.display = "none";
                }
            });

            profileButton.addEventListener("click", () =>{
                navigateTo('/profile');
            });

            logoutButton.addEventListener("click", () => {
                logoutApi();
                navigateTo('/');
            });

            if (loginButton) {
                loginButton.style.display = "none";
            }
        }
        else{
            const userMenu = document.getElementById("user-menu");
            const userEmail = document.getElementById("user-email");
            const loginButton = document.getElementById("login-button");
            document.getElementById("communities-link").style.display = "none";
            document.getElementById("authors-link").style.display = "none";
            document.getElementById("create-post-link").style.display = "none";

            userMenu.style.display = "none";

            if (!loginButton){
                loginButton.style.display = "block"
            }
        }



    } catch (error) {
        console.log ("ошибка при загрузке хэдера: " + error.message);
    }
};