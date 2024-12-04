import {getCommunities, getMyCommunities, subscribe, unSubscribe} from "../api/community.js";
import {navigateTo} from "./router.js";

export function toggle(button, isSubscribed) {
    if (isSubscribed) {
        button.classList.add("unsubscribe-button");
        button.classList.remove("subscribe-button");
        button.textContent = "Отписаться";
    } else {
        button.classList.add("subscribe-button");
        button.classList.remove("unsubscribe-button");
        button.textContent = "Подписаться";
    }
}

async function loadCommunity(community, myCommunities) {
    const communityElement = document.createElement("div");
    communityElement.classList.add("community");

    const isSubscribed = myCommunities.some(myCommunity => myCommunity.communityId === community.id);
    const buttonClass = isSubscribed ? "unsubscribe-button" : "subscribe-button";
    const buttonText = isSubscribed ? "Отписаться" : "Подписаться";

    communityElement.innerHTML = `
            <a href ="#" class="name" data-link">${community.name}</a>
            <button id="button" class="${buttonClass}">${buttonText}</button>
        `;

    const communityLink = communityElement.querySelector("a");
    communityLink.addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo(`/communities/${community.id}`);
    });

    const isMyCommunity = myCommunities.some(myCommunity => myCommunity.communityId === community.id && myCommunity.role === "Administrator")
    if (isMyCommunity) {
        communityElement.querySelector("button").style.display = "none";
    }

    if (community.isClosed && !isMyCommunity){
        communityElement.style.display = "none";
    }

    const button = communityElement.querySelector("button");
    button.addEventListener("click", async () => {
        if (button.classList.contains("subscribe-button")) {
            await subscribe(community.id);
            toggle(button, true);
        } else if (button.classList.contains("unsubscribe-button")) {
            await unSubscribe(community.id)
            toggle(button, false);
        }
    })

    return communityElement;
}


export async function initializeCommunitiesPage(){
    const form = document.querySelector("main")
    if (!form) {
        return;
    }

    const container = document.getElementById("communities");
    container.innerHTML = '';
    try{
        const [communities, myCommunities] = await Promise.all([
            getCommunities(),
            getMyCommunities()
        ]);
        for (const community of communities) {
            const communityElement = await loadCommunity(community, myCommunities);
            container.appendChild(communityElement);
        }
    } catch (error){
        alert("Ошибка при загрузке сообществ: " + error.message);
    }
}