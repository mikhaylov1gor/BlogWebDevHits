import {getPosts, likePost, unLikePost} from "../api/post.js";
import {navigateTo} from "./router.js";
import {getURLParams, loadTags, updateURLParams} from "./app.js";
import {initializePagination} from "./pagination.js";

export async function loadPost(post){
    let response = await fetch("/templates/post.html");
    if (!response.ok) {
        throw new Error("Не удалось загрузить шаблон поста");
    }

    const postElement = document.createElement('div');
    postElement.innerHTML = await response.text();

    // заполнение шапки
    const apiTime = new Date(post.createTime);
    const formattedTime = apiTime.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    if (post.communityId){
        postElement.querySelector("#author").textContent = `${post.author} - ${formattedTime} в сообществе "${post.communityName}"`;
    } else{
        postElement.querySelector("#author").textContent = `${post.author} - ${formattedTime}`;
    }
    postElement.querySelector("#title").textContent = `${post.title}`;

    // заполнение описания
    if (post.image) {
        const imageElement = postElement.querySelector("#image");
        imageElement.src = post.image;
        imageElement.style.display = "block";
    } else {
        postElement.querySelector("#image").style.display = "none";
    }

    const maxLength = 1000;
    const isLong = post.description.length > maxLength;
    let postDescription = isLong ? post.description.substring(0, maxLength) : post.description;
    const lastPoint = postDescription.lastIndexOf(".")
    if(isLong) {
        postDescription = postDescription.substring(0, lastPoint + 1);
    }
    postElement.querySelector("#post-text").textContent = `${postDescription}`;
    postElement.querySelector("#tags").textContent = post.tags.map(tag => `#${tag.name}`).join(' ');
    postElement.querySelector("#readingTime").textContent = `Время чтения: ${post.readingTime} мин`;

    // заполнение футера
    postElement.querySelector("#comments-count").textContent = `${post.commentsCount}`;
    postElement.querySelector("#likes-count").textContent = `${post.likes}`;

    // обработчики событий
    postElement.querySelector("#title").addEventListener("click", (e)=> {
        e.preventDefault();
        navigateTo(`/post/${post.id}`, false);
    });

    postElement.querySelector("#comment-button").addEventListener("click", (e)=> {
        e.preventDefault();
        navigateTo(`/post/${post.id}`, true);
    });

    const likeButton = postElement.querySelector("#like-button");
    const likeIcon = postElement.querySelector("#like-icon");
    const likeCount = postElement.querySelector("#likes-count");

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


export async function initializeHomePage(authorName) {
    const form = document.querySelector("main");

    if (!form) {
        return;
    }

    const response = await fetch("/templates/pagination.html");
    if (!response.ok) {
        throw new Error("Не удалось загрузить шаблон пагинации");
    }
    const paginationElement = document.querySelector('#pagination');
    paginationElement.innerHTML = await response.text()

    const postsContainer = document.getElementById('posts');
    postsContainer.style.display = "none";
    postsContainer.innerHTML = '';

    if (authorName){
        document.getElementById("author").value = authorName;
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

    // загрузка параметров
    let urlParams = getURLParams();
    if (urlParams.tags) {
        const tags = urlParams.tags.split(",");
        const tagElements = document.getElementById("tags").options;
        for (let i = 0; i < tagElements.length; i++) {
            if (tags.includes(tagElements[i].value)) {
                tagElements[i].selected = true;
            }
        }
    }

    if (urlParams.author) {
        document.getElementById("author").value = urlParams.author;
    }

    if (urlParams.min) {
        document.getElementById("min_reading").value = urlParams.min;
    }

    if (urlParams.max) {
        document.getElementById("max_reading").value = urlParams.max;
    }

    if (urlParams.sorting) {
        document.getElementById("sorting").value = urlParams.sorting;
    }

    if (urlParams.onlyMyCommunities) {
        document.getElementById("only_mine").checked = urlParams.onlyMyCommunities;
    }

    const createPostButton = document.getElementById("create-post-button");
    createPostButton.addEventListener("click", () => {
        navigateTo("/post/create");
    });

    document.addEventListener("submit", async (event) => {
        event.preventDefault();
        postsContainer.innerHTML = '';

        const tags = Array.from(document.getElementById("tags").selectedOptions).map(option => option.value);
        const author = document.getElementById("author").value;
        const min = document.getElementById("min_reading").value;
        const max = document.getElementById("max_reading").value;
        const sorting = document.getElementById("sorting").value;
        const onlyMyCommunities = document.getElementById("only_mine").checked;

        urlParams = getURLParams();
        let page = urlParams.page ? urlParams.page : 1;
        const size = urlParams.size ? urlParams.size : 5;


        updateURLParams("tags", tags);
        updateURLParams("author", author);
        updateURLParams("min", min);
        updateURLParams("max", max);
        updateURLParams("sorting", sorting);
        updateURLParams("onlyMyCommunities", onlyMyCommunities);
        updateURLParams("size", size);
        updateURLParams("page", page);

        const loading = document.getElementById("loading");
        loading.style.display = "block";

        try {
            const data = await getPosts(tags, author, min, max, sorting, onlyMyCommunities, page, size)

            await initializePagination(data.pagination.size, data.pagination.count, data.pagination.current);

            for (const post of data.posts) {
                const postElement = await loadPost(post);
                postsContainer.appendChild(postElement);
            }
        } catch (error){
            updateURLParams("page", 1);
            location.reload();
        } finally {
            postsContainer.style.display = "block";
            loading.style.display = "none";
            paginationElement.style.display = "flex";
        }
    });

    document.dispatchEvent(new Event('submit'));
}
