import { showLoginRegister } from "./loginRegister.js";
import { showWelcome } from "./welcome.js";

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
    try {
      const decodedPayload = JSON.parse(atob(value.split(".")[1]));
      console.log("Decoded JWT Payload:", decodedPayload);
    
      const userRole = decodedPayload.role || 'user';
      localStorage.setItem("role", userRole);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
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
  if (confirm("Are you sure you want to log off?")) {
    setToken(null);
    if (message) message.textContent = "You have been logged off.";
    console.log("User logged off.");
    if (!token) {
      showLoginRegister();
    }
  }
};

export let message = null;
export let role = null;

document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();

  const storedToken = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));

  message = document.getElementById("message");

  if (storedToken && storedUser) {
    console.log('user found, auto login');
    setToken(storedToken);
    showWelcome();
  } else {
    console.log('no user found, show login/register');
    setDiv(document.getElementById("logon-register-div"));
    showLoginRegister();
  }

  window.addEventListener("beforeunload", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));  // ✅ Resave user info
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM fully loaded, checking for elements...");

  [
    "edit-brand-text", 
    "edit-mount-text", 
    "edit-focal-length-text",
    "edit-aperture-text",
    "edit-version-text",
    "edit-serial-number-text",
    "edit-updated-by",
    "edit-status",
    "edit-remarks"
  ].forEach(id => {
    const element = document.getElementById(id);
    console.log(`❓ ${id} exists?`, element ? "✅ YES" : "❌ NO");
  });
});
