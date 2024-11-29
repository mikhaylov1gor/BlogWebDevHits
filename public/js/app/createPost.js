import {loadGroups, loadTags} from "./app.js";


export async function initializeCreatePostPage(){
    const form = document.querySelector("main")

    if (!form) {
        return;
    }

    // загрузка тегов
    await loadTags();

    // загрузка групп
    await loadGroups();
}