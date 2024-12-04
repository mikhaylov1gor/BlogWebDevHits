import {initializeLoginPage} from "./login.js"
import {initializeRegistrationPage} from "./registration.js"
import {initializeProfilePage} from "./profile.js";
import {initializeHomePage} from "./home.js";
import {initializeAuthorsPage} from "./authors.js"
import {loadHeader} from "./header.js"
import {initializeCommunitiesPage} from "./communities.js";
import {initializeCreatePostPage} from "./createPost.js";
import {initializeCommunityPage} from "./communityPage.js";
import {initializePostPage} from "./postPage.js";

const routes = {
    "/": "/templates/home.html",
    "/login": "/templates/login.html",
    "/registration": "/templates/registration.html",
    "/profile": "/templates/profile.html",
    "/authors": "/templates/authors.html",
    "/communities": "/templates/communities.html",
    "/post/create": "/templates/createPost.html",
};

export const loadTemplate = async (path) => {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Не удалось загрузить: ${path}`);
        return await response.text();

    } catch (error){
        console.error(error)
        return "<h1>Ошибка загрузки страницы</h1>";
    }
};

export async function switchRouting(path, value) {
    const communityPageRegex = /^\/communities\/([a-fA-F0-9-]+)$/;

    if (communityPageRegex.test(path)) {
        const communityId = path.match(communityPageRegex)[1];
        await initializeCommunityPage(communityId);
        return;
    }

    switch (path) {
        case "/":
            await initializeHomePage(value);
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
        case "/authors":
            await initializeAuthorsPage();
            break
        case "/communities":
            await initializeCommunitiesPage();
            break;
        case "/post/create":
            await initializeCreatePostPage(value);
            break;
    }
}

export const rendering = async (value) => {
    const app = document.getElementById("app");

    // переход на страницу сообщества или поста
    const path = window.location.pathname;
    const communityPageRegex = /^\/communities\/([a-fA-F0-9-]+)$/;
    const postPageRegex = /^\/post\/([a-fA-F0-9-]+)$/;
    const matchCommunity = path.match(communityPageRegex);
    const matchPost = path.match(postPageRegex);

    if (matchCommunity) {
        const communityId = matchCommunity[1];
        await loadHeader();
        app.innerHTML = await loadTemplate("/templates/communityPage.html");
        await initializeCommunityPage(communityId);
        return;
    }
    else if (matchPost){
        const postId = matchPost[1];
        await loadHeader();
        app.innerHTML = await loadTemplate("/templates/postPage.html");
        await initializePostPage(postId, value);
        return;
    }

    const route = routes[window.location.pathname];
    if (!route) {
        app.innerHTML = "<h1>404 - Страница не найдена</h1>";
        return;
    }
    await loadHeader();
    app.innerHTML = await loadTemplate(route);

    await switchRouting(window.location.pathname, value);
};
export function navigateTo(path, value) {
    history.pushState(null, null, path);
    rendering(value);
}

document.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
        e.preventDefault();
        navigateTo(e.target.href);
    }
});

window.onpopstate = () => rendering();