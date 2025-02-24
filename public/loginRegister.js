import { enableInput, inputEnabled, setDiv } from "./index.js";
import { showLogin } from "./login.js";
import { showRegister } from "./register.js";

const loginRegisterDiv = document.getElementById("logon-register-div");


export const handleLoginRegister = () => {
  enableInput(true);
  const login = document.getElementById("logon-button");
  const register = document.getElementById("register-button");

  loginRegisterDiv.addEventListener("click", (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === login) {
        showLogin();
      } else if (e.target === register) {
        showRegister();
      }
    }
  });
};

export const showLoginRegister = () => {
  if (loginRegisterDiv) {
    setDiv(loginRegisterDiv);
    loginRegisterDiv.style.display = "block";
    enableInput(true);

    const login = document.getElementById("logon-button");
    const register = document.getElementById("register-button");

    login.addEventListener("click", showLogin);
    register.addEventListener("click", showRegister);
  } else {
    console.error("Login/Register div is not initialized.");
  }
};