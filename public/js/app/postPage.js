import {getPost} from "../api/post.js";
import {loadPost} from "./home.js";
import {getAddressChain} from "../api/adress.js";

export async function initializePostPage(postId){
    const main = document.querySelector("main");
    if (!main) {
        return;
    }


    const postsContainer = document.querySelector('#posts');
    const postData = await getPost(postId);
    const postElement = await loadPost(postData);
    postsContainer.appendChild(postElement);
    postElement.querySelector("#address").style.display = "block"
    const addressData = await getAddressChain(postData.addressId);
    postElement.querySelector("#address-text").textContent = addressData.map(item => item.text).join(", ");
}