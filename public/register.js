import {
  inputEnabled,
  setDiv,
  message,
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
  registerDiv = document.getElementById("register-div");
  name = document.getElementById("name");
  email1 = document.getElementById("email1");
  password1 = document.getElementById("password1");
  password2 = document.getElementById("password2");
  const registerNowButton = document.getElementById("register-now-button");
  const registerCancel = document.getElementById("register-cancel");

  enableInput(true);

  registerNowButton.addEventListener("submit", async (e) => {
    if (inputEnabled) {
        if (password1.value != password2.value) {
          message.textContent = "The passwords entered do not match.";
        } else {
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
            
            console.log('fetch response registerNowButton', response)

            const data = await response.json();
            if (response.status === 201) {
              message.textContent = `Registration successful.  Welcome ${data.user.name}`;
              setToken(data.token);

              name.value = "";
              email1.value = "";
              password1.value = "";
              password2.value = "";

              showEquipment();
            } else {
              message.textContent = data.msg;
            }
          } catch (err) {
            console.error(err);
            message.textContent = "A communications error occurred.";
          }

        }
      }
        name.value = "";
        email1.value = "";
        password1.value = "";
        password2.value = "";
        showLoginRegister();
      });
          

  registerCancel.addEventListener("click", (e) => {
    e.preventDefault();
    showLoginRegister();
  });
};

export const showRegister = () => {
  registerDiv = document.getElementById("register-div");
  const registerCancel = document.getElementById("register-cancel");
  const registerNowButton = document.getElementById("register-now-button");
  setDiv(registerDiv);
  
  enableInput(true);

  message.textContent = ""; 
  registerNowButton.style.display = "block";
  registerCancel.style.display = "block";
  registerDiv.style.display = "block";
  
  registerNowButton.addEventListener("click", (e) => {
    e.preventDefault();
    handleRegister();
  });
};