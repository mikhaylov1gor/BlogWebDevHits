import{getTagList} from "../api/tag.js";

export async function initializeHomePage() {
    const form = document.querySelector("main");

    if (!form) {
        return;
    }
    // onlyMine checkbox
    if (!localStorage.getItem("authToken")){
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
        console.log(tags[0])

        tags.forEach(tag => {
            const option = document.createElement("option");
            option.value = tag.id;
            option.textContent = tag.name;
            tagsSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Ошибка при загрузке тегов:", error.message);
    }

    document.getElementById("confirm-button").addEventListener("click", ()=>{

    });
}