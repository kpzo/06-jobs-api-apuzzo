const API_URL = "http://localhost:5000/api/v1";

import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";
import { showRegister } from "./register.js";

let equipmentDiv = null;
let equipmentTable = null;
let equipmentTableHeader = null;


document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  
  if (path === "/api/v1/auth/login") {
      showLogin();
  } else if (path === "/api/v1/auth/register") {
      showRegister();
  } else if (path === "/api/v1/equipment") {
      handleEquipment();
  }
});

export const handleEquipment = () => {
  equipmentDiv = document.getElementById("equipment");
  const logoff = document.getElementById("logoff");
  const addEquipment = document.getElementById("add-equipment");
  equipmentTable = document.getElementById("equipment-table");
  equipmentTableHeader = document.getElementById("equipment-table-header");

  equipmentDiv.addEventListener("click", (e) => {
    if (!inputEnabled) return;

    if (e.target === addEquipment) {
      showAddEdit(null);
    } else if (e.target === logoff) {
      handleLogoff();
    }
  });
};

const handleLogoff = () => {
  setToken(null);
  if (message) message.textContent = "You have been logged off.";
  equipmentTable.replaceChildren([equipmentTableHeader]);
  showLoginRegister();
};



export const showEquipment = async () => {
  setDiv(equipmentDiv);
  enableInput(false);
  const equipmentTable = document.getElementById("equipment-table");
  const response = await fetch ( 
    `${API_URL}/equipment`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
    }
  });

  if (response.status === 401) {
    const unauthMessage = document.getElementById("unauthMessage");
    unauthMessage.style.display = "block";
    unauthMessage.textContent = "Unauthorized access. Please log in.";
    return;
  }

  const data = await response.json();

  if (response.ok && (data.role === "staff" || data.role === "admin")) {
    enableInput(true);
  } else {
    enableInput(false);
    unauthMessage.style.display = "block";
    const inputFields = document.querySelectorAll("input, button");
    inputFields.forEach(field => field.disabled = true);
    
  }

    let children = [equipmentTableHeader];

    if (response.ok) {
      if (data.count === 0) {
        equipmentTable.replaceChildren(...children);
      } else {
        data.equipment.forEach((item) => {
          let rowEntry = document.createElement("tr");
          rowEntry.innerHTML = `
            <td>${item.brand}</td>
            <td>${item.mount}</td>
            <td>${item.focalLength}</td>
            <td>${item.aperture}</td>
            <td>${item.version}</td>
            <td>${item.status}</td>
            <td>${item.serialNumber}</td>
            <td>${item.createdBy}</td>
            <td><button type="button" class="editButton" data-id=${item._id}>edit</button></td>
            <td><button type="button" class="deleteButton" data-id=${item._id}>delete</button></td>
          `;
          children.push(rowEntry);
        });
        equipmentTable.replaceChildren(...children);
      }
    } else {
      if (message) message.textContent = data.msg || "Error loading equipment.";
    }
  }  
  

