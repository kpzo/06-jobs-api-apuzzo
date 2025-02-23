console.log("🚀 login.js is loaded and running!");


// Purpose: Handle the login form and login process.
import {
  inputEnabled,
  setDiv,
  token,
  message,
  enableInput,
  setToken,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showJobs } from "./jobs.js";

let loginDiv = null;
let email = null;
let password = null;


document.addEventListener("DOMContentLoaded", () => {
  const logonForm = document.getElementById("logon-form");
  const logonSubmit = document.getElementById("logon-submit");

  logonForm.addEventListener("submit", async (e) => {
      console.log("🔹 Login form submitted!");

      e.preventDefault(); // ✅ Stops the form from submitting as GET
      console.log("✅ event.preventDefault() was called!");

      const emailValue = document.getElementById("email").value;
      const passwordValue = document.getElementById("password").value;

      console.log("📩 Email:", emailValue);
      console.log("🔑 Password:", passwordValue);

      try {
          const response = await fetch("/api/v1/auth/login", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json"
              },
              body: JSON.stringify({ email: emailValue, password: passwordValue }),
          });

          console.log("🔹 Sent login request, status:", response.status);
          const data = await response.json();

          if (response.ok) {
              console.log("✅ Login successful:", data);
              document.getElementById("message").textContent = `Welcome ${data.user.name}`;
          } else {
              console.error("❌ Login failed:", data.msg);
              document.getElementById("message").textContent = data.msg || "Login failed.";
          }
      } catch (err) {
          console.error("❌ Network error:", err);
          document.getElementById("message").textContent = "A network error occurred.";
      }
  });
});



export const handleLogin = () => {
  loginDiv = document.getElementById("logon-div");
  email = document.getElementById("email");
  password = document.getElementById("password");
  const logonForm = document.getElementById("logon-form");
  const logonSubmit = document.getElementById("logon-submit");
  const logonButton = document.getElementById("logon-button");
  const logonCancel = document.getElementById("logon-cancel");

  logonForm.addEventListener("submit", async (e) => {
    console.log("🔹 Login form submitted");  // Debugging log
    e.preventDefault(); // Prevents default form submission behavior
    console.log("✅ event.preventDefault() was called!");

    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === logonSubmit)  {
        enableInput(false);

        try {
          const headersTest = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        };
        
        console.log("🛠 Headers Test:", headersTest);
        
        const response = await fetch("/api/v1/auth/login", {
            method: "POST",
            headers: headersTest,
            body: JSON.stringify({ email: emailValue, password: passwordValue }),
        });

          const data = await response.json();
          if (response.status === 200) {
            message.textContent = `Logon successful.  Welcome ${data.user.name}`;
            setToken(data.token);

            email.value = "";
            password.value = "";

            showJobs();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.error(err);
          message.textContent = "A communications error occurred.";
        }

        enableInput(true);
      } else if (e.target === logonCancel) {
        logonForm.reset();  // ✅ Reset entire form instead of clearing fields
        showLoginRegister();
    }
    }
  });
};

export const showLogin = () => {
  if (email && password) {
    email.value = "";
    password.value = "";
  }
  setDiv(loginDiv);

  loginDiv.style.display = "block";
};