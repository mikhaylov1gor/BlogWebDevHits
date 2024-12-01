import {rendering,navigateTo} from "./router.js";
import {getTagList} from "../api/tag.js";
import {getCommunity, getMyCommunities} from "../api/community.js";

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

        console.log(groups);


        for (const group of groups) {
            if(group.role === "Administrator") {
                const community = await getCommunity(group.communityId);
                console.log(community);
                const option = document.createElement("option");

                option.value = group.communityId;
                option.textContent = community.name;
                groupsSelect.appendChild(option);
            }
        }
    } catch (error) {
        console.error("ошибка загрузки сообществ:", error.message);
    }
}