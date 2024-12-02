import {getPosts, likePost, unLikePost} from "../api/post.js";
import {navigateTo} from "./router.js";
import {loadTags} from "./app.js";

export async function loadPost(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');

    // шапка
    const apiTime = new Date(post.createTime);
    const formattedTime = apiTime.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
    let header = `
            <header>
                <h3>${post.author} - ${formattedTime} в сообществе "${post.communityName}"</h3>
                <h1>${post.title}</h1>
            </header>
        `;
    if (!post.communityId) {
        header = `
            <header>
                <h3>${post.author} - ${formattedTime}</h3>
                <h1>${post.title}</h1>
            </header>
        `;
    }
    // описание
    const maxLength = 1000;
    const isLong = post.description.length > maxLength;
    let postDescription = isLong ? post.description.substring(0, maxLength) : post.description;
    const lastPoint = postDescription.lastIndexOf(".")
    postDescription = postDescription.substring(0, lastPoint + 1);

    let imageHTML = "";
    if (post.image) {
        imageHTML = `<img src="${post.image}" alt="image" class="post-image">`;
    }

    const description = `
            ${imageHTML}
            <p id ="post-text">
                ${postDescription}
            </p>
            <a href="#" id="show-more" style="display: none;">
                Читать полностью
            </a>
            <a href="#" id="show-less" style="display: none;">
                Скрыть
            </a>
        `;

    // теги и время чтения
    const tagsHTML = post.tags.map(tag => `</small>#${tag.name}</small>`).join(' ');

    const small = `
            <div id="small-container">
                ${tagsHTML}
                <small>Время чтения: ${post.readingTime} мин;</small>
            </div>
        `;

    // футер
    const footer = `
        <div class="post-footer">
            <button id="comment-button">
                <img src="../../icons/comments.png" class="small-icon" alt="comments">
                <span class="comment-count">${post.commentsCount}</span>
            </button>
            <button id="like-button">
                <img src="../../icons/like.png" class="small-icon" alt="likes" id="like-icon">
                <span class="like-count" id="like-count">${post.likes}</span>
            </button>
        </div>
        `;

    // сборка по частям
    postElement.innerHTML = header + description + small + footer;

    const likeButton = postElement.querySelector("#like-button");
    const likeIcon = postElement.querySelector("#like-icon");
    const likeCount = postElement.querySelector("#like-count");

    if (post.hasLike) {
        likeIcon.src = "../../icons/filledLike.png"
    }

    let isLiked = post.hasLike;

    likeButton.addEventListener("click", () => {
        try {
            if (isLiked) {
                isLiked = false;
                unLikePost(post.id);
                likeIcon.src = "../../icons/like.png"
                likeCount.textContent = (parseInt(likeCount.textContent) - 1).toString();
            } else {
                isLiked = true;
                likePost(post.id);
                likeIcon.src = "../../icons/filledLike.png"
                likeCount.textContent = (parseInt(likeCount.textContent) + 1).toString();
            }
        } catch (error) {
            throw new Error(error.message)
        }
    })


    if (isLong) {
        const showMoreLink = postElement.querySelector("#show-more");
        const showLessLink = postElement.querySelector("#show-less");
        const postText = postElement.querySelector("#post-text");
        showMoreLink.style.display = "inline";

        showMoreLink.addEventListener("click", (event) => {
            event.preventDefault()
            postText.textContent = post.description;
            showMoreLink.style.display = "none";
            showLessLink.style.display = "inline";
        })

        showLessLink.addEventListener("click", (event) => {
            event.preventDefault()
            postText.textContent = postDescription;
            showLessLink.style.display = "none";
            showMoreLink.style.display = "inline";
        })
    }
    return postElement;
}

export async function initializeHomePage() {
    const form = document.querySelector("main");

    if (!form) {
        return;
    }
    // onlyMine checkbox
    if (!localStorage.getItem("authToken")) {
        document.getElementById("checkbox_onlyMine").style.display = "none";
        document.getElementById("create-post-button").style.display = "none";
    } else {
        document.getElementById("checkbox_onlyMine").style.display = "block";
        document.getElementById("create-post-button").style.display = "block";
    }

    // загрузка тегов
    await loadTags();

    const createPostButton = document.getElementById("create-post-button");
    createPostButton.addEventListener("click", () => {
        navigateTo("/post/create");
    });

    document.addEventListener("submit", (event) => {
        event.preventDefault();

        const tags = Array.from(document.getElementById("tags").selectedOptions).map(option => option.value);
        const author = document.getElementById("author").value;
        const min = document.getElementById("min_reading").value;
        const max = document.getElementById("max_reading").value;
        const sorting = document.getElementById("sorting").value;
        const onlyMyCommunities = document.getElementById("only_mine").checked;
        const page = 1;
        const size = document.getElementById("pageSize").value;
        document.getElementById("pagination").style.display = "flex";

        const loading = document.getElementById("loading");
        const postsContainer = document.getElementById('posts');
        loading.style.display = "block";
        postsContainer.style.display = "none";
        postsContainer.innerHTML = '';
        getPosts(tags, author, min, max, sorting, onlyMyCommunities, page, size)
            .then(async data => {
                for (const post of data.posts) {
                    const postElement = await loadPost(post);
                    postsContainer.appendChild(postElement);
                }
            })
            .catch(error => {
                console.error("ошибка при загрузке постов", error)
            })
            .finally(()=>{
                postsContainer.style.display = "block";
                loading.style.display = "none";
            })
    });
}
