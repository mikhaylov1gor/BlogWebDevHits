import{getCommunities} from "../api/community.js";

function loadCommunities(data){
    const container = document.getElementById("communities");

    try {
        container.innerHTML = "";

        data.forEach((community) => {
            const communityElement = document.createElement("div");

            if(community.isClosed){
                communityElement.style.display="none";
            }

            communityElement.classList.add("community");

            communityElement.innerHTML = `
            <div class="name">${community.name}</div>
            <button class="subscribe-button">Подписаться</button>
            <button class="unsubscribe-button">Отписаться</button>
      `;
            container.appendChild(communityElement);
        });
    } catch (error) {
        container.innerHTML = "<p>Ошибка при загрузке сообществ</p>";
    }
}

export async function initializeCommunitiesPage(){
    const form = document.querySelector("main")

    if (!form) {
        return;
    }

    const communitiesData = await getCommunities();
    loadCommunities(communitiesData);
}