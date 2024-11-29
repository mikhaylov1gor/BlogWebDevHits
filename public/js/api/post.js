const API_URL = "https://blog.kreosoft.space/api"

export async function getPosts(tags,author,min,max,sorting,onlyMyCommunities,page,size){
    const token = localStorage.getItem("authToken");

    try{
        const params = new URLSearchParams({
            author: author || "",
            min: min || "",
            max: max || "",
            sorting: sorting || "",
            onlyMyCommunities: onlyMyCommunities,
            page: page || 1,
            size: size || 5
        })

        tags.forEach(tag => params.append("tags", tag));

        console.log(`${API_URL}/post?${params.toString()}`);


        const response = await fetch(`${API_URL}/post?${params.toString()}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json',
            }
        });
        if (!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "GetPosts failed")
        }
        return await response.json();

    } catch (error){
        console.error("error", error.message);
        throw error;
    }
}

export async function likePost(postId){
    const token = localStorage.getItem("authToken");

    if (!token){
        throw new Error ("Unauthorized");
    }

    try{
        const response = await fetch(`${API_URL}/post/${postId}/like`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });


    } catch (error){
        console.error("error", error.message);
        throw error;
    }
}

export async function unLikePost(postId){
    const token = localStorage.getItem("authToken");

    if (!token){
        throw new Error ("Unauthorized");
    }

    try{

        const response = await fetch(`${API_URL}/post/${postId}/like`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });


    } catch (error){
        console.error("error", error.message);
        throw error;
    }
}
