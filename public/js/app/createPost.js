import {loadGroups, loadTags} from "./app.js";
import {getAddress} from "../api/adress.js";
import {createPost} from "../api/post.js";
import {createPostToCommunity} from "../api/community.js";

let address = null;
async function loadAddress(){
    const subjectSelect = document.getElementById("subject");
    const citySelect = document.getElementById("city");
    const streetSelect = document.getElementById("street");
    const buildingSelect = document.getElementById("building");
    subjectSelect.innerHTML = "";

    try{
        const  subjects = await getAddress();
        const defaultSubject = document.createElement("option");
        defaultSubject.value = "";
        defaultSubject.textContent = "";
        defaultSubject.setAttribute("guid", null)
        defaultSubject.setAttribute("objectLevel", null)
        subjectSelect.appendChild(defaultSubject);

        for (const subject of subjects) {
            const option = document.createElement("option");
            option.value = subject.objectId;
            option.textContent = subject.text;
            option.setAttribute("guid", subject.objectGuid)
            option.setAttribute("objectLevel", subject.objectLevelText)
            subjectSelect.appendChild(option);
        }
    } catch (error) {
        console.error("ошибка загрузки адреса:", error.message);
    }

    subjectSelect.addEventListener("change", async (event) => {
        const selected = event.target.value;
        citySelect.innerHTML = "";
        streetSelect.innerHTML = "";
        buildingSelect.innerHTML = "";

        const selectedOption = event.target.selectedOptions[0];
        address = selectedOption.getAttribute("guid");

        if (selected) {
            document.querySelector("#selectCity").style.display = "block";
        } else {
            document.querySelector("#selectCity").style.display = "none";
            document.querySelector("#selectStreet").style.display = "none";
            document.querySelector("#selectBuilding").style.display = "none";
            return;
        }

        try {
            const cities = await getAddress(selected);

            const defaultCity = document.createElement("option");
            defaultCity.value = "";
            defaultCity.textContent = "";
            defaultCity.setAttribute("guid", null)
            defaultCity.setAttribute("objectLevel", null)
            citySelect.appendChild(defaultCity);

            for (const city of cities) {
                const option = document.createElement("option");
                option.value = city.objectId;
                option.textContent = city.text;
                option.setAttribute("guid", city.objectGuid)
                option.setAttribute("objectLevel", city.objectLevelText)
                citySelect.appendChild(option);
            }
        } catch (error) {
            console.error("ошибка загрузки адреса:", error.message);
        }
    })

    citySelect.addEventListener("change", async (event) => {
        const selected = event.target.value;
        streetSelect.innerHTML = "";
        buildingSelect.innerHTML = "";

        const selectedOption = event.target.selectedOptions[0];
        address = selectedOption.getAttribute("guid");

        if (selected) {
            document.querySelector("#selectStreet").style.display = "block";
        } else {
            document.querySelector("#selectStreet").style.display = "none";
            document.querySelector("#selectBuilding").style.display = "none";
            return;
        }

        try {
            const streets = await getAddress(selected);

            const defaultStreet = document.createElement("option");
            defaultStreet.value = "";
            defaultStreet.textContent = "";
            defaultStreet.setAttribute("guid", null)
            defaultStreet.setAttribute("objectLevel", null)
            streetSelect.appendChild(defaultStreet);

            for (const street of streets) {
                const option = document.createElement("option");
                option.value = street.objectId;
                option.textContent = street.text;
                option.setAttribute("guid", street.objectGuid)
                option.setAttribute("objectLevel", street.objectLevelText)
                streetSelect.appendChild(option);
            }
        } catch (error) {
            console.error("ошибка загрузки адреса:", error.message);
        }
    })

    streetSelect.addEventListener("change", async (event) => {
        const selected = event.target.value;
        buildingSelect.innerHTML = "";

        const selectedOption = event.target.selectedOptions[0];
        address = selectedOption.getAttribute("guid");

        if (selected) {
            document.querySelector("#selectBuilding").style.display = "block";
        } else {
            document.querySelector("#selectBuilding").style.display = "none";
            return;
        }

        try {
            const buildings = await getAddress(selected);
            console.log(buildings)
            const defaultBuilding = document.createElement("option");
            defaultBuilding.value = "";
            defaultBuilding.textContent = "";
            defaultBuilding.setAttribute("guid", null)
            defaultBuilding.setAttribute("objectLevel", null)
            buildingSelect.appendChild(defaultBuilding);

            for (const building of buildings) {
                const option = document.createElement("option");
                option.value = building.objectId;
                option.textContent = building.text;
                option.setAttribute("guid", building.objectGuid)
                option.setAttribute("objectLevel", building.objectLevelText)
                buildingSelect.appendChild(option);
            }
        } catch (error) {
            console.error("ошибка загрузки адреса:", error.message);
        }
    })

    buildingSelect.addEventListener("change", (event) => {
        const selectedOption = event.target.selectedOptions[0];
        address = selectedOption.getAttribute("guid");
    });
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

    // адрес
    await loadAddress()

    const createButton = document.getElementById("confirm-button")

    createButton.addEventListener("click", async () => {

        const group = document.getElementById("group").value;
        const title = document.getElementById("name").value;
        const description = document.getElementById("text").value;
        const readingTime = document.getElementById("time-reading").value;
        const image = document.getElementById("image").value === "" ? null : document.getElementById("image").value;
        const tags = Array.from(document.getElementById("tags").selectedOptions).map(option => option.value);

        try {
            if (group) {
                await createPostToCommunity(group, title, description, readingTime, image, address, tags);
            } else {
                await createPost(title, description, readingTime, image, address, tags)
            }
        } catch (error) {
            alert("Ошибка создания поста: " + error.message);
        }
    })
}