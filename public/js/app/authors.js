import{getAuthors} from "../api/author.js";

function loadAuthors(authors){
    const container = document.getElementById("authors");

    try {
        container.innerHTML = "";

        authors.forEach((author) => {

            const authorElement = document.createElement("div");
            authorElement.classList.add("author");

            authorElement.innerHTML = `
        <div class="avatar ${author.gender}"></div>
        <div class="info">
          <div class="name">${author.fullName}
            <div class="create" > Создан: ${author.created}</div>
          </div>
          <div class="stats">
            Дата рождения: ${author.birthDate}<br>
            Постов: ${author.posts}, Лайков: ${author.likes}
          </div>
        </div>
      `;
            container.appendChild(authorElement);
        });
    } catch (error) {
        container.innerHTML = "<p>Ошибка при загрузке авторов</p>";
    }
}

export async function initializeAuthorsPage(){
    const form = document.querySelector("main");

    if (!form) {
        return;
    }

    const authorData = await getAuthors();
    console.log(authorData)
    loadAuthors(authorData)
}