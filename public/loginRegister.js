import { inputEnabled, setDiv } from "./index.js";
import { showLogin } from "./login.js";
import { showRegister } from "./register.js";

let loginRegisterDiv = null;

loginRegisterDiv = document.getElementById("logon-register");
const login = document.getElementById("logon");
const register = document.getElementById("register");

export const handleLoginRegister = () => {
  document.addEventListener("DOMContentLoaded", () => {

    if (!loginRegisterDiv || !login || !register) {
      console.error("Login/Register elements not found.");
      return;
    }

    loginRegisterDiv.addEventListener("click", (e) => {
      if (!inputEnabled) return;

      if (e.target === login) {
        showLogin();
      } else if (e.target === register) {
        showRegister();
      }
    });
  });
};

export const showLoginRegister = () => {
  if (loginRegisterDiv) {
    setDiv(loginRegisterDiv);
  } else {
    console.error("Error: loginRegisterDiv not found.");
  }
};
