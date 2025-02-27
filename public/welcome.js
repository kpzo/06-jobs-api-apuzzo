
import { setDiv, handleLogoff } from "./index.js";
import { fetchAndDisplayEquipment } from "./equipment.js";
import { showAddEquipmentForm } from "./addEdit.js";
import { setupEventListeners } from "./equipment.js";
import { showLoginRegister } from "./loginRegister.js";


document.addEventListener('DOMContentLoaded', function() {
    const welcomeDiv = document.getElementById('welcome-div');
    const equipmentDiv = document.getElementById('equipment-div');
    const addEquipmentDiv = document.getElementById('add-equipment-div');
    const welcomeViewEquipmentButton = document.getElementById('view-equipment-after-login-button');
    const welcomeAddEquipmentButton = document.getElementById('add-equipment-after-login-button');
    const logoutFromWelcomeButton = document.getElementById('logoff-button');
    const goBackButton = document.getElementById('go-back-button');
    const requestAccessButton = document.getElementById('request-access-button');
    const user = JSON.parse(localStorage.getItem('user'));
    const userRole = user ? user.role : null;
    const roleInput = document.getElementById('role');
    if (roleInput) {
        roleInput.value = userRole;
    } else {
        console.error("❌ roleInput not found in DOM!");
    }
    
    window.addEventListener("beforeunload", () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));  // ✅ Resave user info
        }
      });

    
    setDiv(welcomeDiv);

    goBackButton.style.display = 'block';
    welcomeViewEquipmentButton.style.display = 'block';
    welcomeAddEquipmentButton.style.display = 'block';
    welcomeDiv.style.display = 'block';
    logoutFromWelcomeButton.style.display = 'block';

    if (goBackButton) {
        goBackButton.addEventListener('click', (e) => {
            e.preventDefault();
            setDiv(welcomeDiv);
        }); 
    }

    if (welcomeViewEquipmentButton) {
        welcomeViewEquipmentButton.addEventListener('click', (e) => {
            e.preventDefault();

            goBackButton.style.display = 'block';

            setDiv(equipmentDiv);
            fetchAndDisplayEquipment();
        });
    }

    if (welcomeAddEquipmentButton) {
        welcomeAddEquipmentButton.addEventListener('click', (e) => {
            e.preventDefault();

            goBackButton.style.display = 'block';
            addEquipmentDiv.style.display = 'block';
        
            setDiv(addEquipmentDiv);
            showAddEquipmentForm();
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
    }
    
    setupEventListeners();
  })

export const showWelcome = () => {
    const welcomeDiv = document.getElementById('welcome-div');
    const equipmentDiv = document.getElementById('equipment-div');
    const welcomeViewEquipmentButton = document.getElementById('view-equipment-after-login-button');
    const welcomeAddEquipmentButton = document.getElementById('add-equipment-after-login-button');
    const logoutFromWelcomeButton = document.getElementById('logoff-button');
    const goBackButton = document.getElementById('go-back-button');
    const requestAccessButton = document.getElementById('request-access-button');
    const user = JSON.parse(localStorage.getItem('user'));
    const userRole = user ? user.role : null;
    const roleInput = document.getElementById('role');
    roleInput.value = userRole;
    
    setDiv(welcomeDiv);
    
    goBackButton.style.display = 'block';
    welcomeViewEquipmentButton.style.display = 'block';
    welcomeAddEquipmentButton.style.display = 'block';
    equipmentDiv.style.display = 'none';
    welcomeDiv.style.display = 'block';
    roleInput.value = userRole;

    if (userRole === 'admin' || userRole === 'staff') {
        setDiv(welcomeDiv);
        welcomeViewEquipmentButton.style.display = 'block';
        welcomeAddEquipmentButton.style.display = 'block';
        logoutFromWelcomeButton.style.display = 'block';    
        requestAccessButton.style.display = 'none';
    } else {
        setDiv(welcomeDiv);
        welcomeViewEquipmentButton.style.display = 'block';
        welcomeAddEquipmentButton.style.display = 'none';
        logoutFromWelcomeButton.style.display = 'block';
        requestAccessButton.style.display = 'block';
    }
}

export const requestAccess = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userEmail = user ? user.email : null;

    if (userEmail) {
        const emailSubject = 'Access Level Change Request';
        const emailBody = `Hello Admin,     
    

    I would like to request an access level change to staff.

    Thank you,
    ${userEmail}`;

        sendEmail('katherineapuzzo@gmail.com', emailSubject, emailBody)
            .then(response => {
                console.log('Email sent successfully:', response);
            })
            .catch(error => {
                console.error('Error sending email:', error);
            });
    }
}