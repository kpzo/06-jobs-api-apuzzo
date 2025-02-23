console.log("🚀 login.js is loaded and running!");

// Purpose: Handle the login form and login process.
import {
  inputEnabled,
  setDiv,
  message,
  enableInput,
  setToken,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showEquipment } from "./equipment.js";

let loginDiv = null;
let email = null;
let password = null;

document.addEventListener("DOMContentLoaded", () => {
  loginDiv = document.getElementById("logon-div");
  email = document.getElementById("email");
  password = document.getElementById("password");
  const logonForm = document.getElementById("logon-form");
  const logonSubmit = document.getElementById("logon-submit");
  const logonButton = document.getElementById("logon-button");
  const logonCancel = document.getElementById("logon-cancel");

  // Add event listener for logonButton to show the login form
  logonButton.addEventListener("click", () => {
    showLogin();
  });

  // Add event listener for logonForm submit
  logonForm.addEventListener("submit", async (e) => {
    console.log("🔹 Login form submitted!");
    e.preventDefault(); // Prevents default form submission behavior
    console.log("✅ event.preventDefault() was called!");

    const emailValue = email.value;
    const passwordValue = password.value;

    console.log("📩 Email:", emailValue);
    console.log("🔑 Password:", passwordValue);

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email: emailValue, password: passwordValue }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        message.textContent = `Logon successful. Welcome ${data.user.name}`;
        viewEquipmentButton.style.display = "block"; // Show the "View Equipment" button
        showEquipment();
      } else {
        message.textContent = data.msg || 'Login Failed';
      }
    } catch (err) {
      console.error("Error Logging In", err);
      message.textContent = "Error Logging In";
    }

    enableInput(true);
  });

  logonCancel.addEventListener("click", () => {
    logonForm.reset(); // Reset entire form instead of clearing fields
    showLoginRegister();
  });
});

export const handleLogin = () => {
  loginDiv = document.getElementById("logon-div");
  email = document.getElementById("email");
  password = document.getElementById("password");
  const logonForm = document.getElementById("logon-form");
  const logonSubmit = document.getElementById("logon-submit");
  const logonButton = document.getElementById("logon-button");
  const logonCancel = document.getElementById("logon-cancel");
  const viewAllEquipmentButton = document.getElementById('view-all-equipment');
  const message = document.getElementById('message');

  // Add event listener for logonButton to show the login form
  logonButton.addEventListener("click", () => {
    showLogin();
  });

  // Add event listener for logonForm submit
  logonForm.addEventListener("submit", async (e) => {
    console.log("🔹 Login form submitted!");
    e.preventDefault(); // Prevents default form submission behavior
    console.log("✅ event.preventDefault() was called!");

    const emailValue = email.value;
    const passwordValue = password.value;

    console.log("📩 Email:", emailValue);
    console.log("🔑 Password:", passwordValue);

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email: emailValue, password: passwordValue }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        message.textContent = `Logon successful. Welcome ${data.user.name}`;
        viewAllEquipmentButton.style.display = "block"; 
        showEquipment();
      } else {
        message.textContent = data.msg || 'Login Failed';
      }
    } catch (err) {
      console.error("Error Logging In", err);
      message.textContent = "Error Logging In";
    }

    enableInput(true);
  });

  logonCancel.addEventListener("click", () => {
    logonForm.reset(); // Reset entire form instead of clearing fields
    showLoginRegister();
  });
};

export const showLogin = () => {
  if (email && password) {
    email.value = "";
    password.value = "";
  }
  setDiv(loginDiv);

  loginDiv.style.display = "block";
};