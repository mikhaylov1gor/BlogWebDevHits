const API_URL = "https://blog.kreosoft.space/api"

export async function getPosts(){
    const token = localStorage.getItem("authToken");

    if (!token){
        throw new Error('Unauthorized');
    }

    try{
        const response = await fetch(`${API_URL}/account/profile`,{
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "GetProfile failed")
        }

        return await response.json();

    } catch (error){
        console.error("error", error.message);
        localStorage.removeItem("authToken")
        throw error;
    }
}