const API_URL = "https://blog.kreosoft.space/api"

export async function getTagList(){
    try{
        const response = await fetch(`${API_URL}/tag`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "GetTags failed")
        }
        return await response.json();

    } catch (error){
        console.error("error", error.message);
        throw error;
    }
}