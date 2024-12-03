const API_URL = "https://blog.kreosoft.space/api"

export async function registerApi(fullName,password,email,birthDate,gender,phoneNumber){
    console.log(JSON.stringify({fullName,password,email,birthDate,gender,phoneNumber}));
    try {
        const response = await fetch (`${API_URL}/account/register`,{

           method: "POST",
           headers: {
               "Content-Type": "application/json",
           },
            body: JSON.stringify({fullName,password,email,birthDate,gender,phoneNumber})
        });


        if (!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "Registration failed")
        }

        const data = await response.json();
        localStorage.setItem("authToken", data.token);
        window.location.href="/";

    } catch(error){
        console.error("Registration failed", error.message);
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
        return data;

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
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "Logout failed")
        }
        console.log('success')
        localStorage.removeItem("authToken");
        window.location.href = "/";

    } catch (error){
        console.error("error", error.message);
        throw error;
    }

}

export async function getProfileApi(){
    const token = localStorage.getItem("authToken");

    if (!token){
        throw new Error('Unauthorized');        throw new Error('Unauthorized');
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

export async function editProfileApi(email,fullName,birthDate,gender,phoneNumber){
    const token = localStorage.getItem("authToken");
    console.log(token);
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
            throw new Error(errorData.message || "EditProfile failed")
        }

        window.location.href="/";

    } catch (error){
        console.error("error", error.message);
        throw error;
    }
}