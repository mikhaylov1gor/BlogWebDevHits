import{getAuthors} from "../api/author.js";

export async function loadAuthor(author, rank) {
    const response = await fetch("/templates/author.html");
    if (!response.ok) {
        console.error(`Ошибка загрузки шаблона: ${response.statusText}`);
        throw new Error("Не удалось загрузить шаблон автора");
    }

    const authorElement = document.createElement('div');
    authorElement.innerHTML = await response.text();

    switch (rank){
        case 1:
            authorElement.querySelector("#avatar").classList.add("popular-1");
            break;
        case 2:
            authorElement.querySelector("#avatar").classList.add("popular-2");
            break;
        case 3:
            authorElement.querySelector("#avatar").classList.add("popular-3");
            break;
    }


    authorElement.querySelector("#avatar").classList.add(author.gender);
    authorElement.querySelector("#name").textContent = `${author.fullName}` || "Anonymous";
    authorElement.querySelector("#create").textContent = `Создан: ${new Date(author.created).toLocaleDateString("ru-RU")}`;
    authorElement.querySelector("#birthData").textContent = `Дата рождения: ${new Date(author.birthDate).toLocaleDateString("ru-RU")}`
    authorElement.querySelector("#posts").textContent = `Постов ${author.posts || 0}`;
    authorElement.querySelector("#likes").textContent = `Лайков ${author.likes || 0}`;

    return authorElement;
}

export async function initializeAuthorsPage() {
    const form = document.querySelector("main");
    if (!form) {
        return;
    }

    const authorContainer = document.getElementById("authors");
    authorContainer.innerHTML = "";

    const authors = await getAuthors();


    const popularAuthors = [...authors].sort((a, b) => {
        if (b.posts === a.posts) {
            return b.likes - a.likes;
        }
        return b.posts - a.posts;
    });

    const popularityMap = new Map();
    popularAuthors.slice(0, 3).forEach((author, index) => {
        popularityMap.set(author.fullName, index + 1);
    });

    try{
        for (const author of authors) {
            const rank = popularityMap.get(author.fullName) || 0;
            const authorElement = await loadAuthor(author, rank);
            authorContainer.appendChild(authorElement);
        }
    } catch (error) {
        alert("Ошибка при загрузке авторов: " + error.message);
    }

}