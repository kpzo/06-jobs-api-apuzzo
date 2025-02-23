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
  const viewEquipmentButton = document.getElementById("view-equipment");

  // Add event listener for logonButton to show the login form
  logonButton.addEventListener("click", (e) => {
    e.preventDefault()
    if (inputEnabled) {
      showLogin();
    }
  enableInput(true);
});

  logonCancel.addEventListener("click", () => {
    e.preventDefault()
    if (inputEnabled) {
      logonForm.reset(); // Reset entire form instead of clearing fields
      showLoginRegister();
    }
  });


  logonSubmit.addEventListener("click", async (e) => {
    e.preventDefault()
    const emailValue = email.value;
    const passwordValue = password.value;

    console.log("📩 Email:", emailValue);

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email: emailValue, password: passwordValue }),
      });

      
      console.log(response);

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        message.textContent = `Logon successful. Welcome ${data.user.name}`;
        viewAllEquipmentButton.style.display = "block"; 
        showEquipment();
      } else {
        message.textContent = data.msg || 'Login Failed';
      }
    } catch (err) {
      console.error("Error Logging In", err);
      message.textContent = "Error Logging In";
    }})
 

  logonCancel.addEventListener("click", () => {
    e.preventDefault()
    logonForm.reset(); // Reset entire form instead of clearing fields
    showLoginRegister();
  });
  
});


  export const handleLogin = () => {
    enableInput(true);
    const logonButton = document.getElementById("logon-button");
    const logonForm = document.getElementById("logon-form");
    // Add event listener for logonButton to show the login form
    logonButton.addEventListener("click", () => {
      if (inputEnabled) {
        showLogin();
      }
    })
  
    // Add event listener for logonForm submit
    logonForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("🔹 logonForm submitted!");
  
      const emailValue = email.value;
      const passwordValue = password.value;
  
      console.log("📩 Email:", emailValue);
  
      try {
        const response = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ email: emailValue, password: passwordValue }),
        });
  
        console.log(response);
  
        const data = await response.json();
  
        if (response.ok) {
          setToken(data.token);
          message.textContent = `Logon successful. Welcome ${data.user.name}`;
          viewAllEquipmentButton.style.display = "block"; 
          showEquipment();
        } else {
          message.textContent = data.msg || 'Login Failed';
        }
      } catch (err) {
        console.error("Error Logging In", err);
        message.textContent = "Error Logging In";
      }
  
      enableInput(true);
    })};

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
