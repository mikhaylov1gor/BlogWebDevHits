import {rendering} from "./router.js";
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
        alert("Ошибка при загрузке тегов: " + error.message);
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

export function validation(value,type){
    switch (type){
        case "phone":
            return validatePhone(value);
    }
}

function validatePhone(value){
    const regex = new RegExp('^\\+7 \\([0-9]{3}\\) [0-9]{3}-[0-9]{2}-[0-9]{2}$')
    return value.match(regex);
}