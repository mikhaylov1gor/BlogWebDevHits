import{initializeLoginPage} from "./login.js"
import{initializeRegistrationPage} from "./registration.js"
import{initializeProfilePage} from "./profile.js";
import{getProfileApi,logoutApi} from "../api/users.js";


const routes = {
    "/": "/templates/home.html",
    "/login": "/templates/login.html",
    "/registration": "/templates/registration.html",
    "/profile": "/templates/profile.html",
};

const loadTemplate = async (path) => {
    try {
        console.log(path)
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Не удалось загрузить: ${path}`);
        return await response.text();

    } catch (error){
        console.error(error)
        return "<h1>Ошибка загрузки страницы</h1>";
    }
};

const loadHeader = async() =>{
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
            userMenu.style.display = "none";

            if (!loginButton){
                loginButton.style.display = "block"
            }
        }



    } catch (error) {
        console.error("Ошибка загрузки header:", error.message);
    }
};

export const rendering = async () => {
    const app = document.getElementById("app");
    const route = routes[window.location.pathname];
    if (!route) {
        app.innerHTML = "<h1>404 - Страница не найдена</h1>";
        return;
    }
    await loadHeader();
    const html = await loadTemplate(route);
    app.innerHTML = html;

    switch (window.location.pathname){
        case "/login":
            initializeLoginPage();
            break;
        case "/registration":
            initializeRegistrationPage();
            break;
        case "/profile":
            initializeProfilePage();
            break;
    }
};
export const navigateTo = (url) => {
    history.pushState(null, null, url);
    rendering();
};

document.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
        e.preventDefault();
        navigateTo(e.target.href);
    }
});

window.addEventListener("popstate", rendering);