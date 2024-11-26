const API_URL = "https://blog.kreosoft.space/api"

export async function getPosts(tags,author,min,max,sorting,onlyMineCommunities,page,size){

    try{
        const params = new URLSearchParams({
            author: author || "",
            min: min || "",
            max: max || "",
            sorting: sorting || "",
            onlyMineCommunities: onlyMineCommunities || false,
            page: page || 1,
            size: size || 10
        })
        tags.forEach(tag => params.append("tags", tag));

        console.log(`${API_URL}/post?${params}`);
        const response = await fetch(`${API_URL}/post?${params.toString()}`);

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
