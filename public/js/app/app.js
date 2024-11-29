import {rendering,navigateTo} from "./router.js";
import {getTagList} from "../api/tag.js";
import {getMyCommunities} from "../api/community.js";

document.addEventListener("DOMContentLoaded", () =>{
    rendering();
});

export async function loadTags(){
    const tagsSelect = document.getElementById("tags");
    tagsSelect.innerHTML = "";

    try {
        const tags = await getTagList();

        tags.forEach(tag => {
            const option = document.createElement("option");
            option.value = tag.id;
            option.textContent = tag.name;
            tagsSelect.appendChild(option);
        });
    } catch (error) {
        console.error("ошибка загрузки тегов:", error.message);
    }
}

export async function loadGroups(){
    const groupsSelect = document.getElementById("group");
    groupsSelect.innerHTML = "";

    try{
        const groups = await getMyCommunities();

        groups.forEach(group => {
            const option = document.createElement("option");
            option.value = group.id;
            option.textContent = group.id;
            groupsSelect.appendChild(option);
        });
    } catch (error) {
        console.error("ошибка загрузки сообществ:", error.message);
    }
}