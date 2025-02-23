import jwt_decode from "jwt-decode";

export const state = {
  inputEnabled: true,
};

let activeDiv = null;

export const setDiv = (newDiv) => {
  if (newDiv !== activeDiv) {
    if (activeDiv) activeDiv.style.display = "none";
    newDiv.style.display = "block";
    activeDiv = newDiv;
  }
};

export let inputEnabled = true;

export const enableInput = (stateValue) => {
  state.inputEnabled = stateValue;
};

export const setToken = (value) => {
  token = value;
  if (value) {
    localStorage.setItem("token", value);
    const decodedToken = jwt_decode(value);
    userRole = decodedToken.role;
  } else {
    localStorage.removeItem("token");
    userRole = null;
  }
};

export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "UTC" };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
};

export let message = null;


import { showEquipment, handleEquipment } from "./equipment.js";
import { showLoginRegister, handleLoginRegister } from "./loginRegister.js";
import { handleLogin } from "./login.js";
import { handleAddEdit } from "./addEdit.js";
import { handleRegister, showRegister } from "./register.js";


document.addEventListener("DOMContentLoaded", () => {
  token = localStorage.getItem("token") || null;
  message = document.getElementById("message");

  handleLoginRegister();
  handleLogin();
  handleEquipment();
  handleRegister();
  handleAddEdit();
  showRegister()

  if (token) {
    showEquipment();
  } else {
    showLoginRegister();
  }
});





// document.addEventListener('DOMContentLoaded', () => {
//   const logonButton = document.getElementById('logon-button');
//   const registerButton = document.getElementById('register-button');
//   const logonDiv = document.getElementById('logon-div');
//   const registerDiv = document.getElementById('register-div');
//   const logonCancelButton = document.getElementById('logon-cancel');
//   const registerCancelButton = document.getElementById('register-cancel');
//   const viewEquipmentFromLoginButton = document.getElementById('view-equipment-from-login');
//   const viewEquipmentFromRegisterButton = document.getElementById('view-equipment-from-register');
//   const equipmentDiv = document.getElementById('equipment');
//   const editEquipmentDiv = document.getElementById('edit-equipment');  
//   const viewAllEquipmentButton = document.getElementById('view-all-equipment');

//   logonButton.addEventListener('click', () => {
//       logonDiv.style.display = 'block';
//       registerDiv.style.display = 'none';
//       equipmentDiv.style.display = 'none';
//       editEquipmentDiv.style.display = 'none';
//   });

//   registerButton.addEventListener('click', () => {
//       registerDiv.style.display = 'block';
//       logonDiv.style.display = 'none';
//       equipmentDiv.style.display = 'none';
//       editEquipmentDiv.style.display = 'none';
//   });

//   logonCancelButton.addEventListener('click', () => {
//       logonDiv.style.display = 'none';
//   });

//   registerCancelButton.addEventListener('click', () => {
//       registerDiv.style.display = 'none';
//   });

//   viewEquipmentFromLoginButton.addEventListener("click", (e) => {
//     e.preventDefault(); // Prevents page refresh
//     history.pushState({}, "", "/equipment"); // Updates the browser URL
//     fetchAndDisplayEquipment(); // Calls the function to render equipment dynamically
// });

// viewEquipmentFromRegisterButton.addEventListener("click", (e) => {
//     e.preventDefault();
//     history.pushState({}, "", "/equipment");
//     fetchAndDisplayEquipment();
// });
// viewAllEquipmentButton.addEventListener('click', (e) => {
//   e.preventDefault();
//   history.pushState({}, "", "/equipment");
//   fetchAndDisplayEquipment();
// });
// const addEquipmentButton = document.getElementById('add-equipment');
// addEquipmentButton.addEventListener('click', (e) => {
//   e.preventDefault();
//   history.pushState({}, "", "/equipment/edit");
//   showAddEquipmentForm();
// })
// })