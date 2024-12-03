const API_URL = "https://blog.kreosoft.space/api"

export async function getNestedComments(id){
    try {
        const params = new URLSearchParams({
            id: id
        })

        const response = await fetch (`${API_URL}/comment/${id}/tree?${params}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "get nested comments failed")
        }

        return await response.json();

    } catch(error){
        console.error("get nested comments failed", error.message);
        throw error;
    }
}

export async function addComment(id,content,parentId) {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw Error("Unauthorized");
    }

    try {
        const params = new URLSearchParams({
            id: id
        })

        const response = await fetch(`${API_URL}/post/${id}/comment?${params}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json',
            },
            body: JSON.stringify({content, parentId})
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "post comment failed")
        }

    } catch (error) {
        console.error("post comment failed", error.message);
        throw error;
    }
}

export async function editComment(id,content){
    const token = localStorage.getItem("authToken");
    if (!token) {
        throw Error("Unauthorized");
    }

    try {
        const params = new URLSearchParams({
            id: id
        })

        const response = await fetch(`${API_URL}/comment/${id}?${params}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json',
            },
            body: JSON.stringify({content})
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "edit comment failed")
        }

    } catch (error) {
        console.error("edit comment failed", error.message);
        throw error;
    }
}

export async function deleteComment(id){
    const token = localStorage.getItem("authToken");
    if (!token) {
        throw Error("Unauthorized");
    }

    try {
        const params = new URLSearchParams({
            id: id
        })

        const response = await fetch(`${API_URL}/comment/${id}?${params}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "delete comment failed")
        }

    } catch (error) {
        console.error("delete comment failed", error.message);
        throw error;
    }
}