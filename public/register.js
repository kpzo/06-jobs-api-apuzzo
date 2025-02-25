import {
  inputEnabled,
  setDiv,
  message,
  enableInput,
  setToken,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showWelcome } from "./welcome.js";

let registerDiv = null;
let name = null;
let email1 = null;
let password1 = null;
let password2 = null;
let roleInput = null;

document.addEventListener("DOMContentLoaded", () => {
  const registerNowButton = document.getElementById("register-now-button");
  const message = document.getElementById("message");
  name = document.getElementById("name");
  email1 = document.getElementById("email1");
  password1 = document.getElementById("password1");
  password2 = document.getElementById("password2");
  roleInput = document.getElementById("registrationRole");
  
  handleRegister();

  registerNowButton.addEventListener("click", async (e) => {
    e.preventDefault();  

      if (name.value === "" || email1.value === "" || password1.value === "" || password2.value === "") {
        message.textContent = "All fields are required.";
        return;
      } 

      if (password1.value !== password2.value) {
        message.textContent = "The passwords entered do not match.";
        return;
      }

      enableInput(false);

      try {
        const response = await fetch("/api/v1/auth/register", {
          method: "POST",
          headers: {"Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            name: name.value,
            email: email1.value,
            password: password1.value,
            role: roleInput.value          
          }),
        })
            
        
      const data = await response.json();

        console.log('fetch response registerNowButton', response)
        console.log('fetch data registerNowButton', data)

        if (response.status === 201) {
          message.textContent = `Registration successful.  Welcome ${data.user.name}`;
          setToken(token);

          name.value = "";
          email1.value = "";
          password1.value = "";
          password2.value = "";

          showWelcome();
            } else {
              message.textContent = data.msg;
            }
          } catch (err) {
            console.error(err);
            message.textContent = "A communications error occurred.";
          }
        })

        enableInput(true);
      })

export const showRegister = () => {
  if (!registerDiv) {
  registerDiv = document.getElementById("register-div");
  }

  const registerCancel = document.getElementById("register-cancel");;
  const registerNowButton = document.getElementById("register-now-button");

  setDiv(registerDiv);  
  enableInput(true);

  message.textContent = ""; 
  registerNowButton.style.display = "block";
  registerCancel.style.display = "block";
  registerDiv.style.display = "block";
}



export const handleRegister = () => {
  registerDiv = document.getElementById("register-div");
  const registerCancel = document.getElementById("register-cancel");
    const registerButton = document.getElementById("register-button");
    const registerNowButton = document.getElementById("register-now-button");

    enableInput(true);
    setDiv(registerDiv);
    registerNowButton.style.display = "block";

    registerButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (inputEnabled) {
        showRegister();
      }
    }); 

    registerCancel.addEventListener("click", (e) => {
      e.preventDefault();
      showLoginRegister();
    });
  }