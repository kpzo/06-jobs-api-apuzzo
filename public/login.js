

import {
  inputEnabled,
  setDiv,
  token,
  message,
  enableInput,
  setToken,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showEquipment } from "./equipment.js";

let loginDiv = null;
let email = null;
let password = null;

const logonButton = document.getElementById("logon-button");
const logonCancel = document.getElementById("logon-cancel");

export const handleLogin = () => {
  document.addEventListener("DOMContentLoaded", () => {

    loginDiv = document.getElementById("logon-div");
    email = document.getElementById("email");
    password = document.getElementById("password");

    if (!loginDiv || !email || !password || !logonButton || !logonCancel) {
      console.error("Login elements not found.");
      return;
    }

    loginDiv.addEventListener("click", async (e) => {
      if (!inputEnabled || e.target.nodeName !== "BUTTON") return;

      if (e.target === logonButton) {
        enableInput(false);

        try {
          const response = await fetch("/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.value, password: password.value }),
          });

          const data = await response.json();
          if (response.ok) {
            if (message) message.textContent = `Logon successful. Welcome ${data.user.name}`;
            setToken(data.token);
            email.value = "";
            password.value = "";
            showEquipment();
          } else {
            if (message) message.textContent = data.msg || "Login failed.";
          }
        } catch (err) {
          console.error(err);
          if (message) message.textContent = "A communication error occurred.";
        }

        enableInput(true);
      } else if (e.target === logonCancel) {
        email.value = "";
        password.value = "";
        showLoginRegister();
      }
    });
  });
};

handleLogin(email, password, logonButton, logonCancel);

export const showLogin = () => {
  if (email && password) {
    email.value = "";
    password.value = "";
  }
  setDiv(loginDiv);
};

// async function loginUser(email, password) {
//     try {
//         const response = await fetch(`${API_URL}/auth/login`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ email, password }),
//         });

//         if (!response.ok) {
//             throw new Error("Login failed");
//         }

//         const data = await response.json();
//         console.log("Login successful:", data);
//     } catch (error) {
//         console.error("Error logging in:", error);
//     }
// }

// loginUser("user@example.com", "password123");
