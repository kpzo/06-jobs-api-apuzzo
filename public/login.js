// Purpose: Handle the login form and login process.
import {
  inputEnabled,
  setDiv,
  message,
  enableInput,
  setToken,
  token,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showRegister } from "./register.js";
import { showWelcome } from "./welcome.js";

export const handleLogin = async () => {
  console.log("Handling login...");
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;
  const loginMessage = document.getElementById("message");
  loginMessage.textContent = "";

  if (!email || !password) {
    loginMessage.textContent = "Email and password are required.";
    return;
  }
  if( email && password && role) {
  try {
    const response = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Login failed:", data.msg);
      loginMessage.textContent = data.msg || "Invalid email or password";
      return;
    }

    console.log("Login Successful:", data.user.name);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
    setToken(data.token);

    loginMessage.textContent = `Welcome ${data.user.name}`;
    showWelcome(data.user.role);
  } catch (err) {
    console.error("Login Error:", err);
    loginMessage.textContent = "Error logging in.";
  }
} else {
  loginMessage.textContent = "All fields are required.";
  return;
};}

export const showLogin = () => {
  const logonForm = document.getElementById("logon-form");
  const logonButton = document.getElementById("logon-button");
  const message = document.getElementById("message");
  const logonCancel = document.getElementById("logon-cancel");
  const equipmentDiv = document.getElementById("equipment-div");
  const loginSubmit = document.getElementById("logon-submit");
  const addEquipmentDiv = document.getElementById("add-equipment-div");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const loginDiv = document.getElementById("logon-div");
  const registerButton = document.getElementById("register-button");

  email.value = "";
  password.value = "";

  if (!loginDiv) {
    loginDiv = document.getElementById("logon-div");
  }
  setDiv(loginDiv);
  enableInput(true);

  message.textContent = "";

  loginDiv.style.display = "block";
  logonForm.style.display = "block";
  logonButton.style.display = "none";
  registerButton.style.display = "none";
  loginSubmit.style.display = "block";
  logonCancel.style.display = "block";
  equipmentDiv.style.display = "none";
  logonCancel.style.display = "block";

  if (loginDiv.style.display === "block") {
    addEquipmentDiv.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const loginRegisterDiv = document.getElementById("logon-register-div");
  const logonForm = document.getElementById("logon-form");
  const logonSubmit = document.getElementById("logon-submit");
  const logonButton = document.getElementById("logon-button");
  const logonCancel = document.getElementById("logon-cancel");
  const registerButton = document.getElementById("register-button");
  const registerNowButton = document.getElementById("register-now-button");
  const equipmentDiv = document.getElementById("equipment-div");
  const addEquipmentDiv = document.getElementById("add-equipment-div");
  const goBackButton = document.getElementById("go-back-button");
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user ? user.role : null;
  const roleInput = document.getElementById("role");
  roleInput.value = userRole;

  addEquipmentDiv.style.display = "none";
  equipmentDiv.style.display = "none";
  logonForm.style.display = "none";
  logonSubmit.style.display = "block";
  logonCancel.style.display = "block";
  logonButton.style.display = "block";
  registerNowButton.style.display = "block";
  goBackButton.style.display = "block";

  if(!localStorage.getItem('token')) {
    setDiv(loginRegisterDiv);
  }
  enableInput(true);

  window.addEventListener("beforeunload", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));  // ✅ Resave user info
    }
  });

  // Add event listener for goBackButton to return to the previous view
  goBackButton.addEventListener("click", (e) => {
    e.preventDefault();
    const addEquipmentDiv = document.getElementById("add-equipment-div");
    const welcomeDiv = document.getElementById("welcome-div");

    if (addEquipmentDiv.style.display === "block") {
        setDiv(welcomeDiv);
        showWelcome();
    } else {
        showLogin();
    }
});

registerButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (inputEnabled) {
    showRegister();
  }
});

logonCancel.addEventListener("click", (e) => {
  e.preventDefault();
  if (inputEnabled) {
      logonForm.reset(); // Reset entire form instead of clearing fields
      showLoginRegister();
    }
  });

  logonSubmit.addEventListener("click", async (e) => {
    const welcomeDiv = document.getElementById("welcome-div");
    e.preventDefault();
    enableInput(true);
    if (email.value && password.value) {
      await handleLogin();
      setDiv(welcomeDiv);
      showWelcome();
    } else {
      message.textContent = "Please enter both email and password.";
      showLogin();
    }
  });
  
});