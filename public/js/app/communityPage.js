import {getCommunity, getCommunityPosts} from "../api/community.js";
import {loadTags} from "./app.js";
import{loadPost} from "./home.js";

function loadAuthors(authors) {
    const container = document.getElementById("authors");
    try {
        container.innerHTML = "";

        authors.forEach((author) => {

            const authorElement = document.createElement("div");
            authorElement.classList.add("author");

            authorElement.innerHTML = `
        <div class="avatar ${author.gender}"></div>
        <div class="info">
          <div class="name">${author.fullName}</div>
        </div>
      `;
            container.appendChild(authorElement);
        });
    } catch (error) {
        container.innerHTML = "<p>Ошибка при загрузке авторов</p>";
    }
}

export async function initializeCommunityPage(communityId) {
    const main = document.querySelector("main");
    if (!main) {
        return;
    }

    const communityData = await getCommunity(communityId);
    document.querySelector("#group-name").textContent = `Группа ${communityData.name}`;
    document.querySelector("#subs-count").textContent = `${communityData.subscribersCount} подписчиков`;
    document.querySelector("#community-type").textContent = `тип сообщества: ${communityData.isClosed === true ? "закрытое" : "открытое"}`;

    await loadTags();

    const authors = communityData.administrators;
    loadAuthors(authors);

    document.addEventListener("submit", (event) => {
        event.preventDefault();

        const tags = Array.from(document.getElementById("tags").selectedOptions).map(option => option.value);
        const sorting = document.getElementById("sorting").value;
        const page = 1;
        const size = document.getElementById("pageSize").value;
        document.getElementById("pagination").style.display = "flex";

        const loading = document.getElementById("loading");
        const postsContainer = document.getElementById('posts');
        loading.style.display = "block";
        postsContainer.style.display = "none";
        postsContainer.innerHTML = '';

        getCommunityPosts(communityId,tags,sorting,page,size)
            .then(async data => {
                for (const post of data.posts) {
                    const postElement = await loadPost(post);
                    postsContainer.appendChild(postElement);
                }
            })
            .catch(error => {
                alert("Ошибка при загрузке страницы сообщества: " + error.message);
            })
            .finally(()=>{
                postsContainer.style.display = "block";
                loading.style.display = "none";
            })
    });
}