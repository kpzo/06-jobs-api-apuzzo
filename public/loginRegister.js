
import { enableInput, inputEnabled, setDiv } from "./index.js";
import { showLogin  } from "./login.js";
import { showRegister  } from "./register.js";


document.addEventListener("DOMContentLoaded", () => {
  const loginRegisterDiv = document.getElementById("logon-register-div");
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

  setDiv(loginRegisterDiv);
  enableInput(true)

  loginDiv.style.display = "none";
  registerDiv.style.display = "none";
  equipmentDiv.style.display = "none";
  addEquipmentForm.style.display = "none";
  addEquipmentDiv.style.display = "none";
  logonButton.style.display = "block";
  registerButton.style.display = "block";
  viewEquipmentAfterLoginButton.style.display = "none";
  viewAllEquipmentButton.style.display = "none";

  handleLoginRegister();

});

export const handleLoginRegister = () => {
  const loginRegisterDiv = document.getElementById("logon-register-div");
  const logonButton = document.getElementById("logon-button");
  const registerButton = document.getElementById("register-button");

  enableInput(true);
  setDiv(loginRegisterDiv);
  showLoginRegister();

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

  setDiv(loginRegisterDiv);
  logonDiv.style.display = "none";
  registerDiv.style.display = "none";
  equipmentDiv.style.display = "none";
  enableInput(true)

  logonButton.style.display = "block";
  registerButton.style.display = "block"; 

}