// Purpose: Handle the login form and login process.
import {
  inputEnabled,
  setDiv,
  message,
  enableInput,
  setToken,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showRegister, handleRegister } from "./register.js";

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
  const logonRegisterDiv = document.getElementById("logon-register-div");
  const registerButton = document.getElementById("register-button");
  const viewAllEquipmentButton = document.getElementById("view-all-equipment");
  const equipmentDiv = document.getElementById("equipment-div");
  const addEquipmentDiv = document.getElementById("add-equipment-div");
  const addEquipmentButton = document.getElementById("add-equipment-button");
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user ? user.role : null;
  const roleInput = document.getElementById("role");
  roleInput.value = userRole;


  setDiv(logonRegisterDiv);

  addEquipmentDiv.style.display = "none";
  equipmentDiv.style.display = "none";
  logonForm.style.display = "none";
  logonSubmit.style.display = "block";
  logonCancel.style.display = "none";
  logonButton.style.display = "block";
  registerButton.style.display = "block";


  // Add event listener for logonButton to show the login form
  logonButton.addEventListener("click", (e) => {
    e.preventDefault()
    if (inputEnabled) {
      showLogin();
      handleLogin();
    }
  });

  registerButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (inputEnabled) {
      showRegister();
      handleRegister();
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

  message.textContent = "";

  equipmentDiv.style.display = "none";
  addEquipmentDiv.style.display = "none";
  logonForm.style.display = "block";
  logonSubmit.style.display = "none";
  logonCancel.style.display = "none";

  const emailValue = email.value;
  const passwordValue = password.value;
  const roleValue = userRole || roleInput.value;

  console.log("📩 Email:", emailValue)
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
      
      loginDiv.style.display = "none";
      setDiv(logonRegisterDiv);
      setToken(data.token);
      message.textContent = `Logon successful. Welcome ${data.user.name}`;

      console.log('Showing View Equip. Button')
      viewAllEquipmentButton.style.display = "block";

    if (data.user.role === 'admin' || data.user.role === 'staff') {
      console.log('Showing Add Equip. Button')
      addEquipmentButton.style.display = "block";
    } else {
      console.log('Hiding Add Equip. Button')
      addEquipmentButton.style.display = "none";
    }
  } catch (err) {
    console.error("Error Logging In", err);
    message.textContent = "Error Logging In";
  }
  
  enableInput(true);

})
})

export const showLogin = () => {
  const logonButton = document.getElementById("logon-button");
  const logonCancel = document.getElementById("logon-cancel");
  const equipmentDiv = document.getElementById("equipment-div");
  const addEquipmentDiv = document.getElementById("add-equipment-div");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const loginDiv = document.getElementById("logon-div");

  if (email && password) {
    email.value = "";
    password.value = "";
  }

  setDiv(loginDiv);
  enableInput(true);

  message.textContent = "";

  logonButton.style.display = "block";
  logonCancel.style.display = "block";
  equipmentDiv.style.display = "none";
  addEquipmentDiv.style.display = "none";
}


export const handleLogin = () => {
  enableInput(true);
  const logonButton = document.getElementById("logon-button");
  const logonSubmit = document.getElementById("logon-submit");
  const logonForm = document.getElementById("logon-form");
  const viewAllEquipmentButton = document.getElementById("view-all-equipment");
  const message = document.getElementById("message");
  const equipmentDiv = document.getElementById("equipment-div");

  setDiv(loginDiv);

  equipmentDiv.style.display = "none";
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
  logonSubmit.addEventListener("click", async (e) => {
    e.preventDefault(); 
    if (inputEnabled) {
      await handleLogin();
      viewAllEquipmentButton.style.display = "block";
    }
  })
}