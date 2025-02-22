import {
  inputEnabled,
  setDiv,
  message,
  token,
  enableInput,
  setToken,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showEquipment } from "./equipment.js";

let registerDiv = null;
let name = null;
let email1 = null;
let password1 = null;
let password2 = null;

export const handleRegister = () => {
  document.addEventListener("DOMContentLoaded", () => {
    registerDiv = document.getElementById("register-div");
    name = document.getElementById("name");
    email1 = document.getElementById("email1");
    password1 = document.getElementById("password1");
    password2 = document.getElementById("password2");
    const registerButton = document.getElementById("register-button");
    const registerCancel = document.getElementById("register-cancel");

    if (!registerDiv || !name || !email1 || !password1 || !password2 || !registerButton || !registerCancel) {
      console.error("Registration elements not found.");
      return;
    }

    registerDiv.addEventListener("click", async (e) => {
      if (!inputEnabled || e.target.nodeName !== "BUTTON") return;

      if (e.target === registerButton) {
        if (password1.value !== password2.value) {
          if (message) message.textContent = "The passwords entered do not match.";
          return;
        }

        enableInput(false);

        try {
          const response = await fetch("/api/v1/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name.value,
              email: email1.value,
              password: password1.value,
            }),
          });

          const data = await response.json();
          if (response.ok) {
            if (message) message.textContent = `Registration successful. Welcome ${data.user.name}`;
            setToken(data.token);

            name.value = "";
            email1.value = "";
            password1.value = "";
            password2.value = "";

            showEquipment();
          } else {
            if (message) message.textContent = data.msg || "Registration failed.";
          }
        } catch (err) {
          console.error(err);
          if (message) message.textContent = "A communication error occurred.";
        }

        enableInput(true);
      } else if (e.target === registerCancel) {
        name.value = "";
        email1.value = "";
        password1.value = "";
        password2.value = "";
        showLoginRegister();
      }
    });
  });
};

export const showRegister = () => {
  if (email1 && password1 && password2) {
    email1.value = "";
    password1.value = "";
    password2.value = "";
  }
  setDiv(registerDiv);
};
