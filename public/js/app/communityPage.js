import {getCommunity, getCommunityPosts, getMyCommunities, subscribe, unSubscribe} from "../api/community.js";
import {getURLParams, loadTags, updateURLParams} from "./app.js";
import{loadPost} from "./home.js";
import {getProfileApi} from "../api/users.js";
import {toggle} from "./communities.js";
import {navigateTo} from "./router.js";
import {initializePagination} from "./pagination.js";

let canWatch = false;
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

    const response = await fetch("/templates/pagination.html");
    if (!response.ok) {
        throw new Error("Не удалось загрузить шаблон пагинации");
    }
    const paginationElement = document.querySelector('#pagination');
    paginationElement.innerHTML = await response.text()

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
            canWatch = true;
            document.querySelector("#filters").style.display ="block";

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
            document.querySelector("#filters").style.display ="block";
            canWatch = true;
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
            navigateTo("/post/create", communityId);
        } catch (error){
            alert("не удалось загрузить страницу создания поста: " + error.message);
        }
    })


    // загрузка параметров
    let urlParams = getURLParams();

    if (urlParams.sorting) {
        document.getElementById("sorting").value = urlParams.sorting;
    }

    if (urlParams.tags) {
        const tags = urlParams.tags.split(",");
        const tagElements = document.getElementById("tags").options;
        for (let i = 0; i < tagElements.length; i++) {
            if (tags.includes(tagElements[i].value)) {
                tagElements[i].selected = true;
            }
        }
    }

    if (urlParams.page) {
        document.getElementById("pageSize").value = urlParams.page;
    }


    document.addEventListener("submit", async (event) => {
        event.preventDefault();

        const tags = Array.from(document.getElementById("tags").selectedOptions).map(option => option.value);
        const sorting = document.getElementById("sorting").value;

        urlParams = getURLParams();
        const page = urlParams.page ? urlParams.page : 1;
        const size = urlParams.size ? urlParams.size : 5;

        updateURLParams("tags", tags)
        updateURLParams("sorting", sorting);
        updateURLParams("page", page);
        updateURLParams("size", size);


        const loading = document.getElementById("loading");
        const postsContainer = document.getElementById('posts');
        loading.style.display = "block";
        postsContainer.style.display = "none";
        postsContainer.innerHTML = '';

        try {
            const data = await getCommunityPosts(communityId, tags, sorting, page, size)
            await initializePagination(data.pagination.size, data.pagination.count, data.pagination.current);
            for (const post of data.posts) {
                const postElement = await loadPost(post);
                postsContainer.appendChild(postElement);
            }
        } catch (error){
            alert("Ошибка при загрузке страницы сообщества: " + error.message);
        } finally {
            postsContainer.style.display = "block";
            loading.style.display = "none";
            document.getElementById("pagination").style.display = "flex";
        }
    });

    if (canWatch) {
        document.dispatchEvent(new Event('submit'));
    }
}