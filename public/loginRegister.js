
import { enableInput, inputEnabled, setDiv } from "./index.js";
import { showLogin, handleLogin } from "./login.js";
import { showRegister, handleRegister } from "./register.js";


document.addEventListener("DOMContentLoaded", () => {
  const loginRegisterDiv = document.getElementById("logon-register-div");
  const loginDiv = document.getElementById("logon-div");
  const registerDiv = document.getElementById("register-div");
  const equipmentDiv = document.getElementById("equipment-div");
  const addEquipmentForm = document.getElementById("add-equipment-form");
  const addEquipmentDiv = document.getElementById("add-equipment-div");
  const logonButton = document.getElementById("logon-button");
  const registerButton = document.getElementById("register-button");
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user ? user.role : null;
  const roleInput = document.getElementById("role");
  roleInput.value = userRole;


  setDiv(loginRegisterDiv);
  loginDiv.style.display = "none";
  registerDiv.style.display = "none";
  equipmentDiv.style.display = "none";
  addEquipmentForm.style.display = "none";
  addEquipmentDiv.style.display = "none";
  logonButton.style.display = "block";
  registerButton.style.display = "block";

  showLoginRegister();

});

export const handleLoginRegister = () => {

  enableInput(true);
  setDiv(loginRegisterDiv);

  logonButton.addEventListener("click", (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === logonButton) {
        showLogin();
        handleLogin();
      } else if (e.target === registerButton) {
        showRegister();
      }
    }
  });

  registerButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (inputEnabled) {
      showRegister();
      handleRegister();
    }
  });
};

export const showLoginRegister = () => {
  const loginRegisterDiv = document.getElementById("logon-register-div");
  const logonButton = document.getElementById("logon-button");
  const registerButton = document.getElementById("register-button");
  setDiv(loginRegisterDiv);
  enableInput(true);

    logonButton.style.display = "block";
    registerButton.style.display = "block"; 
}