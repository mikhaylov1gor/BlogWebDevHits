const API_URL = "https://blog.kreosoft.space/api"
export async function getAddress(parentObjectId,query) {
    try {
        const params = new URLSearchParams({
            parentObjectId: parentObjectId || "",
            query: query || "",
        })

        const response = await fetch(`${API_URL}/address/search?${params}`, {
            method: "GET",
            headers: {
                "Content-Type": "text/plain"
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "get address failed")
        }

        return await response.json();

    } catch (error) {
        console.error("get address failed", error.message);
        throw error;
    }
}

export async function getAddressChain(id){
    try {
        const params = new URLSearchParams({
            objectGuid: id,
        })

        const response = await fetch(`${API_URL}/address/chain?${params}`, {
            method: "GET",
            headers: {
                "Content-Type": "text/plain"
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "get address chain failed")
        }

        return await response.json();

    } catch (error) {
        console.error("get address chain failed", error.message);
        throw error;
    }
}