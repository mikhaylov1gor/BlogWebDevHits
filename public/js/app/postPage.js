import {getPost} from "../api/post.js";
import {loadPost} from "./home.js";
import {getAddressChain} from "../api/adress.js";
import {addComment, deleteComment, editComment} from "../api/comment.js";
import {getProfileApi} from "../api/users.js";

async function loadComment(postData, comment,myId) {
    const response = await fetch("/templates/comment.html");
    if (!response.ok) {
        console.error(`Ошибка загрузки шаблона: ${response.statusText}`);
        throw new Error("Не удалось загрузить шаблон комментария");
    }

    const commentElement = document.createElement('div');
    commentElement.innerHTML = await response.text();

    const apiTime = new Date(comment.createTime);
    const formattedTime = apiTime.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    if (comment.subComments === 0) {
        commentElement.querySelector("#show-replies").style.display = "none";
    }

    if (comment.deleteDate) {
        commentElement.querySelector("#comment-name").textContent = "[Комментарий удален]";
        commentElement.querySelector("#comment-description").textContent = "[Комментарий удален]";
        commentElement.querySelector("#comment-date").textContent = formattedTime;
        commentElement.querySelector("#reply").style.display="none";
    } else {
        commentElement.querySelector("#comment-name").textContent = comment.author;
        commentElement.querySelector("#comment-description").textContent = comment.content;
        commentElement.querySelector("#comment-date").textContent = formattedTime;
    }

    if (comment.modifiedDate && !comment.deleteDate){
        const modifiedTag = document.createElement('span');
        modifiedTag.textContent = " (изменен)";
        modifiedTag.style.color = "gray";
        commentElement.querySelector("#comment-description").appendChild(modifiedTag);
    }

    const deleteButton = commentElement.querySelector("#delete-button");
    const editButton = commentElement.querySelector("#edit-button");
    if (comment.authorId === myId && !comment.deleteDate){
        deleteButton.style.display = "block";
        editButton.style.display = "block";
    }

    deleteButton.addEventListener("click", async (event) => {
        event.preventDefault();

        try {
            await deleteComment(comment.id)
            location.reload();
        } catch (error){
            alert("ошибка при удалении комментария: " + error.message)
        }
    })

    let editFlag = false;
    editButton.addEventListener("click", (event) =>{
        event.preventDefault();

        if (!editFlag){
            commentElement.querySelector("#comment-description").style.display = "none";
            commentElement.querySelector("#edit-row").style.display = "flex";
            commentElement.querySelector("#modify-text").textContent = comment.content;
            editFlag = true;
        }
        else{
            commentElement.querySelector("#comment-description").style.display = "flex";
            commentElement.querySelector("#edit-row").style.display = "none";
            editFlag = false;
        }
    })

    commentElement.querySelector("#edit-button-submit").addEventListener("click", async (event) => {
        event.preventDefault();
        try {
            await editComment(comment.id, commentElement.querySelector("#modify-text").value);
            location.reload();
        } catch (error) {
            alert("ошибка при изменении комментария" + error.message)
        }
    });


    let replyFlag = false;
    commentElement.querySelector("#reply").addEventListener("click",(event) => {
        event.preventDefault();

        if (!replyFlag){
            commentElement.querySelector("#reply-row").style.display = "flex";
            replyFlag = true;
        }
        else{
            commentElement.querySelector("#reply-row").style.display = "none";
            replyFlag = false;
        }
    });

    commentElement.querySelector("#reply-button-submit").addEventListener("click", async(event) =>{
        event.preventDefault();
        try {
            await addComment(postData.id, commentElement.querySelector("#reply-text").value, comment.id)
            location.reload();
        } catch (error) {
            alert("ошибка при изменении комментария" + error.message)
        }
    });

    return commentElement;
}

export async function initializePostPage(postId, value) {
    const main = document.querySelector("main");
    if (!main) {
        return;
    }

    let id = null;
    const token = localStorage.getItem("authToken");
    if (token){
        const authorData = await getProfileApi();
        id = authorData.id;
    }

    const postsContainer = document.querySelector('#posts');
    const postData = await getPost(postId);
    const postElement = await loadPost(postData);
    postsContainer.appendChild(postElement);

    if (postData.addressId) {
        postElement.querySelector("#address").style.display = "block"
        const addressData = await getAddressChain(postData.addressId);
        postElement.querySelector("#address-text").textContent = addressData.map(item => item.text).join(", ");
    }

    const commentsContainer = document.querySelector("#comments-bodies")
    commentsContainer.innerHTML="";

    const comments = postData.comments;
    try{
        for (const comment of comments) {
            const commentElement = await loadComment(postData,comment,id);
            commentsContainer.appendChild(commentElement);
        }
    } catch (error) {
        alert("Ошибка при загрузке комментариев: " + error.message);
    }

    console.log(value);
    if (value){
        const scrollToContainer = document.querySelector("#comments-container")
        scrollToContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    document.getElementById("new-comment").addEventListener("submit", async (event) => {
        event.preventDefault();

        const description = document.getElementById("description").value;
        console.log("Description value:", description);
        if (!description) {
            alert("Комментарий не может быть пустым.");
            return;
        }
        try {
            await addComment(postData.id, description, null);
        } catch (error) {
            alert("Ошибка при создании комментария: " + error.message);
        } finally {
            location.reload();
        }
    });

}