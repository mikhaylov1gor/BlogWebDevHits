import{initializeLoginPage} from "./login.js"
import{initializeRegistrationPage} from "./registration.js"

const routes = {
    "/": "/templates/home.html",
    "/login": "/templates/login.html",
    "/registration": "/templates/registration.html",
    "/profile": "/templates/profile.html",
};

const loadTemplate = async (path) => {
    try {
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