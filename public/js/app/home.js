import {getPosts, likePost, unLikePost} from "../api/post.js";
import {navigateTo} from "./router.js";
import {loadTags} from "./app.js";

export async function loadPost(post){
    const response = await fetch("/templates/post.html");
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

    const createPostButton = document.getElementById("create-post-button");
    createPostButton.addEventListener("click", () => {
        navigateTo("/post/create");
    });

    document.addEventListener("submit", (event) => {
        event.preventDefault();
        postsContainer.innerHTML = '';

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
        loading.style.display = "block";
        getPosts(tags, author, min, max, sorting, onlyMyCommunities, page, size)
            .then(async data => {
                for (const post of data.posts) {
                    const postElement = await loadPost(post);
                    postsContainer.appendChild(postElement);
                }
            })
            .catch(error => {
                alert("Ошибка при загрузке постов: " + error.message);
            })
            .finally(()=>{
                postsContainer.style.display = "block";
                loading.style.display = "none";
            })
    });
}
