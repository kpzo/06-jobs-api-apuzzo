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
  const viewAllEquipmentButton = document.getElementById("view-all-equipment");
  const userRole = localStorage.getItem("role");
  const roleInput = document.getElementById("role");
  roleInput.value = userRole;
  const addEquipmentButton = document.getElementById("add-equipment");

  setDiv(loginDiv);

  logonSubmit.style.display = "none";
  logonCancel.style.display = "none";

  // Add event listener for logonButton to show the login form
  logonButton.addEventListener("click", (e) => {
    e.preventDefault()
    if (inputEnabled) {
      showLogin();
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
  console.log("🔹 logonSubmit button clicked!")

  setDiv(loginDiv);
  enableInput(false);

  const emailValue = email.value;
  const passwordValue = password.value;
  const roleValue = userRole || roleInput.value;

  console.log("📩 Email:", emailValue)
  console.log("🔑 Password:", passwordValue)
  console.log("👤 Role:", roleValue)

if (!emailValue || !passwordValue || !roleValue) {
  console.warn('email, password, and role are required')
  message.textContent = 'Email, Password, and Role are required'
  enableInput(true)
  return
}

  try {
    const response = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ email: emailValue, password: passwordValue, role: roleValue }),
    });

    console.log('Server Response:', response);

    const data = await response.json();
    console.log('API Data:', data);

    if (!response.ok) {
      console.error("Error Logging In", data.msg)
      message.textContent = data.msg || 'Login Failed';
      enableInput(true);
      return;
    }
      console.log('Login Successful:', data.user.name)
      setToken(data.token);
      message.textContent = `Logon successful. Welcome ${data.user.name}`;

      console.log('Showing View Equip. Button')
      viewAllEquipmentButton.style.display = "block"; 

    if (data.user.role === 'admin' || data.user.role === 'staff') {
      console.log('Showing Add Equip. Button')
      addEquipmentButton.style.display = "block";
    }
    console.log('Showing Equipment')
      showEquipment();
    } catch (err) {
      console.error("Error Logging In", err);
      message.textContent = "Error Logging In";
    }
    enableInput(true);
  })

})

export const showLogin = () => {
  const logonSubmit = document.getElementById("logon-submit");
  const logonCancel = document.getElementById("logon-cancel");

  if (email && password) {
    email.value = "";
    password.value = "";
  }
  setDiv(loginDiv);
  logonSubmit.style.display = "block";
  logonCancel.style.display = "block";
}


export const handleLogin = () => {
  enableInput(true);
  const logonButton = document.getElementById("logon-button");
  const logonForm = document.getElementById("logon-form");
  const viewAllEquipmentButton = document.getElementById("view-all-equipment");

  setDiv(loginDiv);
  logonForm.style.display = "block";
  viewAllEquipmentButton.style.display = "none";
  message.textContent = "";

  // Add event listener for logonButton to show the login form
  logonButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (inputEnabled) {
      showLogin();
    }
  })

  // Add event listener for logonForm submit
}