const API_URL = "https://blog.kreosoft.space/api"

export async function registerApi(fullName,password,email,birthDate,gender,phoneNumber){
    try {
        const response = await fetch (`${API_URL}/account/register}`,{
           method: "POST",
           headers: {
               "Content-Type": "application/json",
           },
            body: JSON.stringify({fullName,password,email,birthDate,gender,phoneNumber})
        });

        if (!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed")
        }

        const data = await response.json();
        localStorage.setItem("authToken", data.token);
        return data

    } catch(error){
        console.error("Login failed", error.message);
        throw error;
    }
}
export async function loginApi(email,password){
    try {
        const response = await fetch(`${API_URL}/account/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email,password}),
        });

        if (!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed")
        }

        const data = await response.json();
        localStorage.setItem("authToken", data.token);
        return data

    } catch(error){
        console.error("Login failed", error.message);
        throw error;
    }
}

export async function logoutApi(){
    const token = localStorage.getItem("authToken");

    if (!token){
        throw new Error('Unauthorized');
    }

    try{
        const response = await fetch(`${API_URL}/account/logout`,{
            method: "POST",
            headers: {
                'Authorization': 'Bearer ${token}'
            },
        });
    } catch (error){
        console.error("error", error.message);
        throw error;
    }

    localStorage.removeItem('authToken');
    console.log('Выход успешен');
    window.location.href = '/index.html';
}

export async function getProfileApi(){
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
            throw new Error(errorData.message || "Login failed")
        }

        return await response.json();

    } catch (error){
        console.error("error", error.message);
        throw error;
    }
}

export async function editProfileApi(email,fullName,birthDate,gender,phoneNumber){
    const token = localStorage.getItem("authToken");

    if (!token){
        throw new Error('Unauthorized');
    }

    try{
        const response = await fetch(`${API_URL}/account/profile`,{
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email,fullName,birthDate,gender,phoneNumber}),
        });

        if (!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed")
        }

        return await response.json();

    } catch (error){
        console.error("error", error.message);
        throw error;
    }
}