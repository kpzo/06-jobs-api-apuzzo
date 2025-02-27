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
    showLoginRegister();
};


export let message = null;
export let role = null;


import { handleLoginRegister, showLoginRegister } from "./loginRegister.js";


document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();

  window.addEventListener("beforeunload", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));  // ✅ Resave user info
    }
  });
  
  token = localStorage.getItem("token");
  message = document.getElementById("message");
  role = localStorage.getItem("role");

  if (!document.getElementById("logon-register-div")) {
    return;
  } else {
    setDiv(document.getElementById("logon-register-div"));

    showLoginRegister();
    handleLoginRegister();
  }
});