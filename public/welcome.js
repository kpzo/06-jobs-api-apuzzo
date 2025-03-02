
import { setDiv, handleLogoff, token } from "./index.js";
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
    
    welcomeViewEquipmentButton.style.display = 'none';
    welcomeAddEquipmentButton.style.display = 'none';
    logoutFromWelcomeButton.style.display = 'none';
    requestAccessButton.style.display = 'none';
    goBackButton.style.display = 'none';
    addEquipmentDiv.style.display = 'none';


    window.addEventListener("beforeunload", () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));  // ✅ Resave user info
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
            e.preventDefault();

            goBackButton.style.display = 'block';
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

            goBackButton.style.display = 'block';
            addEquipmentDiv.style.display = 'block';
            if (token) {
                setDiv(addEquipmentDiv);
                showAddEquipmentForm();
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
    }
    
    setDiv(welcomeDiv);
    setupEventListeners();
  })

export const showWelcome = () => {
    const welcomeDiv = document.getElementById('welcome-div');
    const welcomeViewEquipmentButton = document.getElementById('view-equipment-after-login-button');
    const welcomeAddEquipmentButton = document.getElementById('add-equipment-after-login-button');
    const logoutFromWelcomeButton = document.getElementById('logoff-button');
    const goBackButton = document.getElementById('go-back-button');
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
    
    goBackButton.style.display = 'block';
    welcomeViewEquipmentButton.style.display = 'block';
    logoutFromWelcomeButton.style.display = 'block';

    setDiv(welcomeDiv);
    setupEventListeners();
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
