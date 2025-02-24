// Purpose: Handle the login form and login process.
import {
  inputEnabled,
  setDiv,
  message,
  enableInput,
  setToken,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showRegister } from "./register.js";
import { showWelcome } from "./welcome.js";

let loginDiv = null;

document.addEventListener("DOMContentLoaded", () => {
  const loginRegisterDiv = document.getElementById("logon-register-div");
  loginDiv = document.getElementById("logon-div");
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

  setDiv(loginRegisterDiv);
  enableInput(true);

  // Add event listener for goBackButton to return to the previous view
  goBackButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (inputEnabled) {
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
})

});

// Reusable login function
export const handleLogin = async (emailValue, passwordValue, roleValue) => {
  const message = document.getElementById("message");
  const equipmentDiv = document.getElementById("equipment-div");
  const addEquipmentButton = document.getElementById("add-equipment-button");
  const loginDiv = document.getElementById("logon-div");
  const loginRegisterDiv = document.getElementById("logon-register-div");
  const logonForm = document.getElementById("logon-form");
  const logonSubmit = document.getElementById("logon-submit");
  const email = document.getElementById("email");
  const logonButton = document.getElementById("logon-button");
  const password = document.getElementById("password");
  const welcomeDiv = document.getElementById("welcome-div");
  const welcomeViewEquipmentButton = document.getElementById("view-equipment-after-login-button");
  const logoutFromWelcomeButton = document.getElementById("logout-from-welcome-button");
  const welcomeAddEquipmentButton = document.getElementById("add-equipment-after-login-button");

  if (!loginDiv) {
    loginDiv = document.getElementById("logon-div");
  }

// Add event listener for logonButton to show the login form
  logonButton.addEventListener("click", (e) => {
    e.preventDefault();
    setDiv(loginDiv);
    if (inputEnabled) {
      showLogin();
    }
  });

  logonSubmit.addEventListener("click", async (e) => {
    e.preventDefault();
    enableInput(false);
  
    const emailValue = email.value;
    const passwordValue = password.value;
    const roleValue = role.value;
    const loginSuccess = await handleLogin(emailValue, passwordValue, roleValue);
    
     try {
    // 🔹 Send login request to the API
    const response = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailValue, password: passwordValue }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Login failed:", data.msg);
      message.textContent = data.msg || "Invalid email or password";
      enableInput(true);
      return false;
    }

    console.log("Login Successful:", data.user.name);

    // 🔹 Save user info securely
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    setToken(data.token);

    // 🔹 UI Updates After Login
    message.textContent = `Welcome ${data.user.name}`;
    loginDiv.style.display = "none";
    loginRegisterDiv.style.display = "none";
    equipmentDiv.style.display = "none";

        // 🔹 Show Add Equipment Button if Admin/Staff
    if (data.user.role === "admin" || data.user.role === "staff") {
      console.log("Showing Welcome Buttons for Admin/Staff");
      setDiv(welcomeDiv);
      welcomeViewEquipmentButton.style.display = "block";
      logoutFromWelcomeButton.style.display = "block";
      welcomeAddEquipmentButton.style.display = "block";
      showWelcome();
    } else {
      setDiv(equipmentDiv);
      addEquipmentButton.style.display = "none";
    }

    return true; // Login successful
  } catch (err) {
    console.error("Login Error:", err);
    message.textContent = "Error logging in.";
    return false;
  }
  })
}

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
  addEquipmentDiv.style.display = "none";
  logonCancel.style.display = "block";
}
