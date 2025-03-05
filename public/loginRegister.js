
import { enableInput, inputEnabled, setDiv } from "./index.js";
import { showLogin  } from "./login.js";
import { showWelcome  } from "./welcome.js";
import { showRegister  } from "./register.js";


document.addEventListener("DOMContentLoaded", () => {
  const loginRegisterDiv = document.getElementById("logon-register-div");
  const welcomeDiv = document.getElementById("welcome-div");
  const loginDiv = document.getElementById("logon-div");
  const registerDiv = document.getElementById("register-div");
  const equipmentDiv = document.getElementById("equipment-div");
  const addEquipmentForm = document.getElementById("add-equipment-form");
  const addEquipmentDiv = document.getElementById("add-equipment-div");
  const logonButton = document.getElementById("logon-button");
  const registerButton = document.getElementById("register-button");
  const viewEquipmentAfterLoginButton = document.getElementById("view-equipment-after-login-button");
  const viewAllEquipmentButton = document.getElementById("view-all-equipment-button");
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user ? user.role : null;
  const roleInput = document.getElementById("role");
  roleInput.value = userRole;

  const storedToken = localStorage.getItem("token");

  if (storedToken) {
    setDiv(welcomeDiv);
    loginRegisterDiv.style.display = "none";
    return;
  } else {
  setDiv(loginRegisterDiv);
  enableInput(true)
  }

  welcomeDiv.style.display = "none";
  loginDiv.style.display = "none";
  registerDiv.style.display = "none";
  equipmentDiv.style.display = "none";
  addEquipmentForm.style.display = "none";
  addEquipmentDiv.style.display = "none";
  logonButton.style.display = "block";
  registerButton.style.display = "block";
  viewEquipmentAfterLoginButton.style.display = "none";

  handleLoginRegister();

});

export const handleLoginRegister = () => {
  const loginRegisterDiv = document.getElementById("logon-register-div");
  const logonButton = document.getElementById("logon-button");
  const registerButton = document.getElementById("register-button");

  enableInput(true);
  setDiv(loginRegisterDiv);

  logonButton.style.display = "block";
  registerButton.style.display = "block";

  logonButton.addEventListener("click", (e) => {
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
};

export const showLoginRegister = () => {
  const loginRegisterDiv = document.getElementById("logon-register-div");
  const logonButton = document.getElementById("logon-button");
  const registerButton = document.getElementById("register-button");
  const logonDiv = document.getElementById("logon-div");
  const equipmentDiv = document.getElementById("equipment-div");
  const registerDiv = document.getElementById("register-div");

  const storedToken = localStorage.getItem("token");

  if (storedToken) {
    return;
  }

  setDiv(loginRegisterDiv);
  logonDiv.style.display = "none";
  registerDiv.style.display = "none";
  equipmentDiv.style.display = "none";
  enableInput(true)

  logonButton.style.display = "block";
  registerButton.style.display = "block"; 

}