import {getCommunity, getCommunityPosts, getMyCommunities, subscribe, unSubscribe} from "../api/community.js";
import {loadTags} from "./app.js";
import{loadPost} from "./home.js";
import {getProfileApi} from "../api/users.js";
import {toggle} from "./communities.js";
import {navigateTo} from "./router.js";

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

    const token = localStorage.getItem("authToken");
    if (token) {
        const profile = await getProfileApi();
        const myId = profile.id;
        // отписаться-подписаться
        if (!communityData.isClosed) {
            document.querySelector("#subscribe-action-button").style.display = "inline";

            const myComms = await getMyCommunities();
            if (myComms.some(community => community.userId === myId && communityId === community.communityId)) {
                document.querySelector("#subscribe-action-button").textContent = "Отписаться";
                document.querySelector("#subscribe-action-button").classList.add("unsubscribe-button");
            } else {
                document.querySelector("#subscribe-action-button").textContent = "Подписаться";
                document.querySelector("#subscribe-action-button").classList.add("subscribe-button");
            }
        }

        // написать пост
        if (communityData.administrators.some(admin => admin.id === myId)) {
            document.querySelector("#create-post-button").style.display = "inline";
            document.querySelector("#subscribe-action-button").style.display = "none";
        }
    }

    const subActionButton = document.querySelector("#subscribe-action-button");
    subActionButton.addEventListener("click", async (event) => {
        event.preventDefault();
        if (subActionButton.classList.contains("subscribe-button")) {
            await subscribe(communityId);
            toggle(subActionButton, true);
        } else if (subActionButton.classList.contains("unsubscribe-button")) {
            await unSubscribe(communityId)
            toggle(subActionButton, false);
        }
    })

    const createPostButton = document.querySelector("#create-post-button");
    createPostButton.addEventListener("click", async (event)=>{
        event.preventDefault();
        try {
            navigateTo("/", communityId);
        } catch (error){
            alert("не удалось загрузить посты автора: " + error.message);
        }
    })


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