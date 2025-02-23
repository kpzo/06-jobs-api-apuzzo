
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
  inputEnabled = stateValue;
};

export let token = null;
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
import { handleLogin, showLogin } from "./login.js";
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

  if (token) {
    showEquipment();
  } else {
    showLoginRegister();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const logonButton = document.getElementById('logon-button');
  const registerButton = document.getElementById('register-button');
  const logonDiv = document.getElementById('logon-div');
  const registerDiv = document.getElementById('register-div');
  const logonCancelButton = document.getElementById('logon-cancel');
  const registerCancelButton = document.getElementById('register-cancel');
  const equipmentDiv = document.getElementById('equipment');
  const editEquipmentDiv = document.getElementById('edit-equipment');  
  const viewAllEquipmentButton = document.getElementById('view-all-equipment');
  const message = document.getElementById('message');

  logonButton.addEventListener('click', () => {
      logonDiv.style.display = 'block';
      registerDiv.style.display = 'none';
      equipmentDiv.style.display = 'none';
      editEquipmentDiv.style.display = 'none';
      showLogin(); // Calls the function to render equipment dynamically
  });

  registerButton.addEventListener('click', () => {
      registerDiv.style.display = 'block';
      logonDiv.style.display = 'none';
      equipmentDiv.style.display = 'none';
      editEquipmentDiv.style.display = 'none';
  });

  logonCancelButton.addEventListener('click', () => {
      logonDiv.style.display = 'none';
  });

  registerCancelButton.addEventListener('click', () => {
      registerDiv.style.display = 'none';
  });


  const addEquipmentButton = document.getElementById('add-equipment');
  addEquipmentButton.addEventListener('click', (e) => {
    e.preventDefault();
    history.pushState({}, "", "/equipment/edit");
    showAddEquipmentForm();
  });
});