import{initializeLoginPage} from "./login.js"
import{initializeRegistrationPage} from "./registration.js"
import{initializeProfilePage} from "./profile.js";
import{initializeHomePage} from "./home.js";
import{loadHeader} from "./header.js"


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

export async function switchRouting(path) {
    switch (path) {
        case "/":
            initializeHomePage();
            break;
        case "/login":
            initializeLoginPage();
            break;
        case "/registration":
            initializeRegistrationPage();
            break;
        case "/profile":
            await initializeProfilePage();
            break;
    }
}

export const rendering = async () => {
    const app = document.getElementById("app");
    const route = routes[window.location.pathname];
    console.log(route);
    if (!route) {
        app.innerHTML = "<h1>404 - Страница не найдена</h1>";
        return;
    }
    await loadHeader();
    const html = await loadTemplate(route);
    app.innerHTML = html;

    await switchRouting(window.location.pathname);
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