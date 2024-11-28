const API_URL = "https://blog.kreosoft.space/api"

export async function getAuthors(){
    try {
        const response = await fetch (`${API_URL}/author/list`,{
            method: "GET",
        });

        if (!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "Registration failed")
        }

        return await response.json();

    } catch(error){
        console.error("Login failed", error.message);
        throw error;
    }
}