const API_URL = "https://blog.kreosoft.space/api"

export async function getCommunities(){
    try {
        const response = await fetch (`${API_URL}/community`,{
            method: "GET"
        });

        if (!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "Error")
        }

        return await response.json();

    } catch(error){
        console.error("Login failed", error.message);
        throw error;
    }
}

export async function getMyCommunities() {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Unauthorized");
    }

    try {
        const response = await fetch(`${API_URL}/community/my`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Subscribe failed")
        }

        return await response.json();

    } catch (error) {
        console.error("get communities failed", error.message);
        throw error;
    }
}

export async function getCommunity(id){
    try {
        const response = await fetch(`${API_URL}/community/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": `application/json`
            },
        });

        if (!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "get concrete community failed")
        }

        return await response.json()

    } catch(error){
        console.error("get concrete community failed", error.message);
        throw error;
    }
}

export async function getCommunityPosts(id,tags,sorting,page,size){
    const token = localStorage.getItem("authToken");

    try {
        const params = new URLSearchParams({
            id: id,
            sorting: sorting || "",
            page: page || 1,
            size: size || 5
        })

        tags.forEach(tag => params.append("tags", tag));

        const response = await fetch(`${API_URL}/community/${id}/post?${params.toString()}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json',
            },
        });

        if (!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "get community posts failed")
        }
        return await response.json();

    } catch(error){
        console.error("Subscribe failed", error.message);
        throw error;
    }
}

export async function createPostToCommunity(id, title, description, readingTime, image, addressId, tags) {
    const token = localStorage.getItem("authToken");

    if (!token){
        throw new Error("Unauthorized");
    }

    try {
        const params = new URLSearchParams({
            id: id,
        })

        const response = await fetch(`${API_URL}/community/${id}/post?${params}`, {
            method: "POST",
            headers:{
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json',
            },
            body: JSON.stringify({title, description, readingTime, image, addressId, tags})
        });

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "create post failed")
        }

        window.location.href="/";

    } catch (error){
        console.error("create post failed", error.message);
        throw error;
    }
}

export async function subscribe(id){
    const token = localStorage.getItem("authToken");

    if(!token){
        throw new Error("Unauthorized")
    }
    try {
        const response = await fetch(`${API_URL}/community/${id}/subscribe`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        if (!response.ok){
            const errorData = await response.json();
            console.error("Subscribe failed", errorData.message);
            throw new Error(errorData.message || "Subscribe failed")
        }

    } catch(error){
        console.error("Subscribe failed", error.message);
        throw error;
    }
}

export async function unSubscribe(id){
    const token = localStorage.getItem("authToken");

    if(!token){
        throw new Error("Unauthorized")
    }
    try {
        const response = await fetch(`${API_URL}/community/${id}/unsubscribe`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        if (!response.ok){
            const errorData = await response.json();
            console.error("Unsubscribe failed", errorData.message);
            throw new Error(errorData.message || "Unsubscribe failed")
        }

    } catch(error){
        console.error("Unsubscribe failed", error.message);
        throw error;
    }
}