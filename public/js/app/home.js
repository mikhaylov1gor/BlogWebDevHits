import{getTagList} from "../api/tag.js";
import{getPosts} from "../api/post.js";

function loadPost(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');

    // шапка
    const header = `
            <header>
                <h3>${post.author} - ${post.createTime} в сообществе "${post.communityName}"</h3>
                <h1>${post.title}</h1>
            </header>
        `;

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
                <button class="comment-button">
                    <i class="fas fa-comment"></i> Комментарии <span class="comment-count">(${post.commentsCount})</span>
                </button>
                <button class="like-button">
                    <i class="fas fa-thumbs-up"></i> Лайк <span class="like-count">(${post.likes})</span>
                </button>
            </div>
        `;

    // сборка по частям
    postElement.innerHTML = header + description + small + footer;

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
    const tagsSelect = document.getElementById("tags");

    try {
        const tags = await getTagList();

        tagsSelect.innerHTML = "";

        tags.forEach(tag => {
            const option = document.createElement("option");
            option.value = tag.id;
            option.textContent = tag.name;
            tagsSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Ошибка при загрузке тегов:", error.message);
    }

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

        getPosts(tags, author, min, max, sorting, onlyMyCommunities, page, size)
            .then(data => {
                console.log(data);
                const postsContainer = document.getElementById('posts'); // Контейнер для постов
                postsContainer.innerHTML = '';


                data.posts.forEach(post => {
                    const postElement = loadPost(post);
                    postsContainer.appendChild(postElement);
                });
            })
            .catch(error => {
                console.error("ошибка при загрузке постов", error)
            })

    });
}
