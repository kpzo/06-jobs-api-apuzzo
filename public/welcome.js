
import { setDiv, handleLogoff, token } from "./index.js";
import { fetchAndDisplayEquipment } from "./equipment.js";
import { showAddEquipmentForm } from "./addEdit.js";
import { setupEventListeners } from "./equipment.js";
import { showLoginRegister } from "./loginRegister.js";



document.addEventListener('DOMContentLoaded', function() {

    const welcomeDiv = document.getElementById('welcome-div');
    const equipmentDiv = document.getElementById('equipment-div');
    const addEquipmentDiv = document.getElementById('add-equipment-div');
    const loginRegisterDiv = document.getElementById('logon-register-div');

    const welcomeViewEquipmentButton = document.getElementById('view-equipment-after-login-button');
    const welcomeAddEquipmentButton = document.getElementById('add-equipment-after-login-button');
    const logoutFromWelcomeButton = document.getElementById('logoff-button');
    const requestAccessButton = document.getElementById('request-access-button');

    const user = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('token');

    if(!storedToken) {
        console.log('no user found, show login/register');
        setDiv(loginRegisterDiv);
        return;
    }

    const userRole = user ? user.role : null;

    welcomeViewEquipmentButton.style.display = 'none';
    welcomeAddEquipmentButton.style.display = 'none';
    logoutFromWelcomeButton.style.display = 'none';
    requestAccessButton.style.display = 'none';
    addEquipmentDiv.style.display = 'none';


    window.addEventListener("beforeunload", () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));  // Resave user info
        }
      });

    if(userRole === 'user') {
        welcomeViewEquipmentButton.style.display = 'block';
        logoutFromWelcomeButton.style.display = 'block';
        requestAccessButton.style.display = 'block';
    } else if (userRole === 'staff' || userRole === 'admin') {
        welcomeViewEquipmentButton.style.display = 'block';
        welcomeAddEquipmentButton.style.display = 'block';
        logoutFromWelcomeButton.style.display = 'block';
    }

    if (welcomeViewEquipmentButton) {
        welcomeViewEquipmentButton.addEventListener('click', (e) => {
            const editEquipmentForm = document.getElementById('edit-equipment-form');
            e.preventDefault();

            if (editEquipmentForm !== null) {
                            return;
                        }
            
            if (token) {
                setDiv(equipmentDiv);
                fetchAndDisplayEquipment();
            } else {
                showLoginRegister();
            }
        });
    }

    if (welcomeAddEquipmentButton) {
        welcomeAddEquipmentButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (token) {
                setDiv(addEquipmentDiv);
                showAddEquipmentForm();
                welcomeDiv.style.display = 'none';
            } else {
                showLoginRegister();
            }
            
        });
    }
    
    if (logoutFromWelcomeButton) {
        logoutFromWelcomeButton.addEventListener('click', (e) => {
            e.preventDefault();
            const loginRegisterDiv = document.getElementById('logon-register-div');

            handleLogoff();
            setDiv(loginRegisterDiv);
            showLoginRegister();
        });
    }

    if (requestAccessButton) {
        requestAccessButton.addEventListener('click', (e) => {
            e.preventDefault();
            requestAccess();
        });
    } else { 
    setDiv(welcomeDiv);
    setupEventListeners();
  }
});



export const showWelcome = () => {
    const welcomeDiv = document.getElementById('welcome-div');
    const welcomeViewEquipmentButton = document.getElementById('view-equipment-after-login-button');
    const welcomeAddEquipmentButton = document.getElementById('add-equipment-after-login-button');
    const logoutFromWelcomeButton = document.getElementById('logoff-button');
    const requestAccessButton = document.getElementById('request-access-button');

    const user = JSON.parse(localStorage.getItem('user'));
    const userRole = user ? user.role : 'user';

    if (userRole === 'admin' || userRole === 'staff') {
        welcomeAddEquipmentButton.style.display = 'block';
        requestAccessButton.style.display = 'none';
    } else {
        welcomeAddEquipmentButton.style.display = 'none';
        requestAccessButton.style.display = 'block';
    }
    
    welcomeViewEquipmentButton.style.display = 'block';
    logoutFromWelcomeButton.style.display = 'block';

    setDiv(welcomeDiv);
    setupEventListeners();
}


export const requestAccess = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found.");
        alert("You must be logged in to request access.");
        return;
    }

    try {
        const response = await fetch("/api/v1/request-access", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // Send token to backend
            },
        });

        const data = await response.json();
        if (response.ok) {
            console.log("Request access email sent successfully:", data);
            alert("Request sent! An admin will review your request.");
        } else {
            console.error("Failed to send request:", data);
            alert("Error sending request. Try again later.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
};