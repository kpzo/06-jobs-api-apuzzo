import { showLoginRegister } from "./loginRegister.js";
import { showWelcome } from "./welcome.js";

let activeDiv = null;
export const setDiv = (newDiv) => {
    if (!newDiv) {
        console.error("setDiv() called with no div.");
        return;
    }

    document.querySelectorAll(".page").forEach((div) => {
        div.style.display = "none";
    });

    if (newDiv !== activeDiv) {
        newDiv.style.display = "block";
        activeDiv = newDiv;
    }
};

export let message = null;

export let inputEnabled = true;
export const enableInput = (state) => { inputEnabled = state; };

export let token = null;
export const setToken = (value) => {
    token = value;
    if (value) {
        localStorage.setItem("token", value);
        try {
            const decodedPayload = decodeJWT(value);
            localStorage.setItem("user", JSON.stringify({
                _id: decodedPayload?.userId || decodedPayload?._id || null,
                name: decodedPayload?.name || null,
                email: decodedPayload?.email || null,
                role: decodedPayload?.role || 'user',
            }));
            
            console.log("Decoded JWT Payload:", decodedPayload);
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }
};

console.log("Received Token:", localStorage.getItem("token"));


export const decodeJWT = (token) => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(base64));
    } catch (error) {
        console.error("Error decoding token:", error);
        return {};
    }
};

export const handleLogoff = () => {
    const welcomeDiv = document.getElementById("welcome-div");
    
    if (confirm("Are you sure you want to log off?")) {
        localStorage.clear();
        setToken(null);
        console.log("User logged off.");
        setDiv(document.getElementById("logon-register-div"));
        showLoginRegister();
        welcomeDiv.style.display = "none";
        location.reload();
    }
};

// Ensure session persistence on reload
document.addEventListener("DOMContentLoaded", () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
        console.log('User found, auto login');
        setToken(storedToken);
        showWelcome();
    } else {
        console.log('No user found, show login/register');
        setDiv(document.getElementById("logon-register-div"));
        showLoginRegister();
    }
});