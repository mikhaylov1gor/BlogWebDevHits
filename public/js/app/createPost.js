import {getURLParams, loadGroups, loadTags, updateURLParams} from "./app.js";
import {getAddress} from "../api/adress.js";
import {createPost} from "../api/post.js";
import {createPostToCommunity} from "../api/community.js";

let addressId = null;

async function loadAddress(address) {
    const addressForm = document.getElementById("address-field");

    const response = await fetch("/templates/address.html");
    if (!response.ok) {
        console.error(`Ошибка загрузки шаблона: ${response.statusText}`);
        throw new Error("Не удалось загрузить шаблон комментария");
    }

    const addressElement = document.createElement('div');
    addressElement.innerHTML = await response.text();

    const subjects = await getAddress(address);

    if (subjects.length === 0){
        return;
    }

    const selector = addressElement.querySelector("#subject");

    try {
        const defaultSubject = document.createElement("option");
        defaultSubject.value = "";
        defaultSubject.textContent = "";
        defaultSubject.setAttribute("guid", null)
        defaultSubject.setAttribute("objectLevel", "")
        selector.appendChild(defaultSubject);

        for (const subject of subjects) {
            const option = document.createElement("option");
            option.value = subject.objectId;
            option.textContent = subject.text;
            option.setAttribute("guid", subject.objectGuid)
            option.setAttribute("objectLevel", subject.objectLevelText)
            selector.appendChild(option);
        }
    } catch (error) {
        console.error("ошибка загрузки адреса:", error.message);
    }

    addressForm.appendChild(addressElement);

    addressElement.addEventListener("change", (event) =>{
        event.preventDefault();

        const selectedOption = selector.options[selector.selectedIndex];

        if (selectedOption.textContent !== "") {
            addressId = selectedOption.getAttribute("guid");
        }
        else {
            const previousElement = addressElement.previousSibling;
            if (previousElement){
                const previousSelector = previousElement.querySelector("#subject");
                const previousSelectedOption =
                    previousSelector.options[previousSelector.selectedIndex];
                addressId = previousSelectedOption.getAttribute("guid");
            } else{
                addressId = null;
            }
        }

        while (addressElement.nextSibling) {
            addressForm.removeChild(addressElement.nextSibling);
        }

        addressElement.querySelector("label").textContent = selectedOption.getAttribute("objectLevel")

        if (selectedOption.value) {
            loadAddress(selectedOption.value);
        }
    })
}

export async function initializeCreatePostPage(communityId) {
    const form = document.querySelector("main")

    if (!form) {
        return;
    }

    // загрузка тегов
    await loadTags();

    // загрузка групп
    await loadGroups();

    // загрузка параметров
    if (communityId){
        updateURLParams("group", communityId);
    }

    const urlParams = getURLParams();

    if (urlParams.group) {
        document.getElementById("group").value = urlParams.group;
    }

    if (urlParams.title) {
        document.getElementById("name").value = urlParams.title;
    }

    if (urlParams.description) {
        document.getElementById("text").value = urlParams.description;
    }

    if (urlParams.readingTime) {
        document.getElementById("time-reading").value = urlParams.readingTime;
    }

    if (urlParams.image) {
        document.getElementById("image").value = urlParams.image;
    }

    if (urlParams.tags) {
        const tags = urlParams.tags.split(",");
        const tagElements = document.getElementById("tags").options;
        for (let i = 0; i < tagElements.length; i++) {
            if (tags.includes(tagElements[i].value)) {
                tagElements[i].selected = true;
            }
        }
    }

    // адрес
    await loadAddress(null)

    const createButton = document.getElementById("confirm-button")

    createButton.addEventListener("click", async () => {

        const group = document.getElementById("group").value;
        const title = document.getElementById("name").value;
        const description = document.getElementById("text").value;
        const readingTime = document.getElementById("time-reading").value;
        const image = document.getElementById("image").value === "" ? null : document.getElementById("image").value;
        const tags = Array.from(document.getElementById("tags").selectedOptions).map(option => option.value);

        updateURLParams("group",group)
        updateURLParams("title", title);
        updateURLParams("description", description);
        updateURLParams("readingTime", readingTime);
        updateURLParams("image", image);
        updateURLParams("tags", tags);

        try {
            if (group !== "null") {
                await createPostToCommunity(group, title, description, readingTime, image, addressId, tags);
            } else {
                await createPost(title, description, readingTime, image, addressId, tags)
            }
        } catch (error) {
            alert("Ошибка создания поста: " + error.message);
        }
    })
}