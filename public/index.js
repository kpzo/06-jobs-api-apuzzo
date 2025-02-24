let activeDiv = null;
export const setDiv = (newDiv) => {
  if (newDiv != activeDiv) {
    if (activeDiv) {
      activeDiv.style.display = "none";
    }
    newDiv.style.display = "block";
    activeDiv = newDiv;
  }
};

export let inputEnabled = true;

export const enableInput = (state) => {
  inputEnabled = state;
};

export let token = null;
export const setToken = (value) => {
  token = value;
  if (value) {
    localStorage.setItem("token", value);
    const userRole = JSON.parse(atob(value.split(".")[1])).role;
    localStorage.setItem("role", userRole);
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }
};

export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "UTC" };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
};

export const handleLogoff = () => {
  setToken(null);
    if (message) message.textContent = "You have been logged off.";
    equipmentTable.replaceChildren([equipmentTableHeader]);
    showLoginRegister();
};


export let message = null;
export let role = null;


import { handleLoginRegister, showLoginRegister } from "./loginRegister.js";
import { handleLogin } from "./login.js";
import { handleRegister } from "./register.js";
import { showEquipment } from "./equipment.js";


document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
  token = localStorage.getItem("token");
  message = document.getElementById("message");
  role = localStorage.getItem("role");

  if (token) {
    handleLoginRegister();
    handleLogin();
    handleRegister();

    const viewAllEquipmentButton = document.getElementById("view-all-equipment-button");
    if (token) {
      viewAllEquipmentButton.style.display = "block";
      viewAllEquipmentButton.addEventListener("click", (e) => {
        e.preventDefault();
        showEquipment();
      });
    }
  } else {
    showLoginRegister();
  }
});