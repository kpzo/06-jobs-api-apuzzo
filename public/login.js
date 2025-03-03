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

  if (!email || !password || !role) {
      loginMessage.textContent = "Email, password, and role are required.";
      return false;
  }

  try {
      const response = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
          console.error("Login failed:", data.msg);
          loginMessage.textContent = data.msg || "Invalid email or password";
          return false;
      }

      console.log("Login Successful:", data.user.name);
      setToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Show welcome page only after token is set
      showWelcome();
      return true;

  } catch (err) {
      console.error("Login Error:", err);
      loginMessage.textContent = "Error logging in.";
      return false;
  }
};


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
    e.preventDefault();

    const welcomeDiv = document.getElementById("welcome-div");
    const message = document.getElementById("message");
    const logonDiv = document.getElementById("logon-div");

    enableInput(true)

    const success = await handleLogin();

    if (success) {
      setDiv(welcomeDiv);
      loginRegisterDiv.style.display = "none";
      logonDiv.style.display = "none";
      message.textContent = "Welcome! Login successful.";
    } else {
      setDiv(logonDiv);
      message.textContent = "Invalid credentials, please try again.";
    }
  });
});