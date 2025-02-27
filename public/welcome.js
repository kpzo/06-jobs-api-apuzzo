
import { setDiv } from "./index.js";
import { showAddEquipmentForm, fetchAndDisplayEquipment } from "./equipment.js";
import { setupEventListeners } from "./equipment.js";


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
    setupEventListeners();
    
    goBackButton.style.display = 'block';
    welcomeViewEquipmentButton.style.display = 'block';
    welcomeAddEquipmentButton.style.display = 'block';
    welcomeDiv.style.display = 'block';

    goBackButton.addEventListener('click', (e) => {
        e.preventDefault();
        setDiv(welcomeDiv);
    });

    welcomeViewEquipmentButton.addEventListener('click', (e) => {
        e.preventDefault();
        goBackButton.style.display = 'block';
        setDiv(equipmentDiv);
        fetchAndDisplayEquipment();
    });

    welcomeAddEquipmentButton.addEventListener('click', (e) => {
        e.preventDefault();
        const goBackButton = document.getElementById('go-back-button');
        goBackButton.style.display = 'block';
        setDiv(addEquipmentDiv);
        showAddEquipmentForm();
    });
  }
)

export const showWelcome = () => {
    const welcomeDiv = document.getElementById('welcome-div');
    const equipmentDiv = document.getElementById('equipment-div');
    const addEquipmentDiv = document.getElementById('add-equipment-div');
    const welcomeViewEquipmentButton = document.getElementById('view-equipment-after-login-button');
    const welcomeAddEquipmentButton = document.getElementById('add-equipment-after-login-button');
    const goBackButton = document.getElementById('go-back-button');
    const user = JSON.parse(localStorage.getItem('user'));
    const userRole = user ? user.role : null;
    const roleInput = document.getElementById('role');
    roleInput.value = userRole;
    
    setDiv(welcomeDiv);
    
    goBackButton.style.display = 'block';
    welcomeViewEquipmentButton.style.display = 'block';
    welcomeAddEquipmentButton.style.display = 'block';
    equipmentDiv.style.display = 'none';
    addEquipmentDiv.style.display = 'none';
    welcomeDiv.style.display = 'block';
    roleInput.value = userRole;

    if (userRole === 'admin' || userRole === 'staff') {
        setDiv(welcomeDiv);
        welcomeViewEquipmentButton.style.display = 'block';
        welcomeAddEquipmentButton.style.display = 'block';
    }
}