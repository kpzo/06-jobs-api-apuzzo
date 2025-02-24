
import { setDiv } from "./index.js";
import { showEquipment, showAddEquipmentForm } from "./equipment.js";


document.addEventListener('DOMContentLoaded', function() {
    const welcomeDiv = document.getElementById('welcome-div');
    const loginRegisterDiv = document.getElementById('logon-register-div');
    const equipmentDiv = document.getElementById('equipment-div');
    const addEquipmentDiv = document.getElementById('add-equipment-div');
    const welcomeViewEquipmentButton = document.getElementById('view-equipment-after-login-button');
    const welcomeAddEquipmentButton = document.getElementById('add-equipment-after-login-button');
    const logoutFromWelcomeButton = document.getElementById('logout-from-welcome-button');
    const goBackButton = document.getElementById('go-back-button');
    const user = JSON.parse(localStorage.getItem('user'));
    const userRole = user ? user.role : null;
    const roleInput = document.getElementById('role');
    roleInput.value = userRole;
    
    setDiv(welcomeDiv);
    
    goBackButton.style.display = 'block';

    goBackButton.addEventListener('click', (e) => {
        e.preventDefault();
        setDiv(loginRegisterDiv);
    });

    welcomeViewEquipmentButton.addEventListener('click', (e) => {
        e.preventDefault();
        const goBackButton = document.getElementById('go-back-button');
        goBackButton.style.display = 'block';
        setDiv(equipmentDiv);
        showEquipment();
    });

    welcomeAddEquipmentButton.addEventListener('click', (e) => {
        e.preventDefault();
        const goBackButton = document.getElementById('go-back-button');
        goBackButton.style.display = 'block';
        setDiv(addEquipmentDiv);
        showAddEquipmentForm();
    });

    logoutFromWelcomeButton.addEventListener('click', (e) => {
        e.preventDefault();
        const goBackButton = document.getElementById('go-back-button');
        goBackButton.style.display = 'block';
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setDiv(loginRegisterDiv);
        enableInput(true);
    });
  }
)

export const showWelcome = () => {
    const welcomeDiv = document.getElementById('welcome-div');
    const user = JSON.parse(localStorage.getItem('user'));
    const userRole = user ? user.role : null;
    const roleInput = document.getElementById('role');
    roleInput.value = userRole;
    setDiv(welcomeDiv);
  }