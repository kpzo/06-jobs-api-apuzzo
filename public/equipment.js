import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";

import { showLoginRegister } from "./loginRegister.js";
import { showWelcome } from "./welcome.js";

const API_URL = "http://localhost:5000/api/v1";

let equipmentDiv, equipmentTable;

document.addEventListener("DOMContentLoaded", () => {
  if (token) {
    showWelcome();
  }
  else {
    showLoginRegister();
  }
  document.getElementById("add-equipment-div").style.display = "none";
});

export async function showEquipment() {
  equipmentDiv = document.getElementById("equipment-div");
  equipmentTable = document.getElementById("equipment-table");

  setupEventListeners();
  await fetchAndDisplayEquipment();
}

export function setupEventListeners() {
  document.getElementById("view-all-equipment-button").addEventListener("click", (e) => {
    e.preventDefault();
    fetchAndDisplayEquipment();
  });

  document.getElementById("logoff-button").addEventListener("click", () => {
    setToken(null);
    message.textContent = "You have been logged off.";
    showLoginRegister();
  });

  document.getElementById("add-equipment-button").addEventListener("click", showAddEquipmentForm);

  document.getElementById("edit-equipment-button").addEventListener("click", showEditForm);
}

export async function addEquipment() {
  const brand = document.getElementById("brand").value;
  const mount = document.getElementById("mount").value;
  const focalLength = document.getElementById("focal-length").value;
  const aperture = document.getElementById("aperture").value;
  const version = document.getElementById("version").value;
  const serialNumber = document.getElementById("serial-number").value;
  const updatedBy = document.getElementById("updated-by").value;
  const status = document.getElementById("status").value;

  if (!brand || !mount || !focalLength || !aperture || !version || !serialNumber || !updatedBy || !status) {
    message.textContent = "All fields are required.";
    return;
  }

  try {
    const response = await fetch(`${API_URL}/equipment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        brand,
        mount,
        focalLength,
        aperture,
        version,
        serialNumber,
        updatedBy,
        status,
      }),
    });

    if (!response.ok) throw new Error("Failed to add equipment");

    const { equipment } = await response.json();
    updateEquipmentTable(equipment);
    message.textContent = "Equipment added.";
  } catch (error) {
    console.error("Error adding equipment:", error);
    message.textContent = "Error adding equipment.";
  }
}

export async function fetchAndDisplayEquipment() {
  try {
    const response = await fetch(`${API_URL}/equipment`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch equipment");

    const { equipment } = await response.json();
    updateEquipmentTable(equipment);
  } catch (error) {
    console.error("Error fetching equipment:", error);
    message.textContent = "Error loading equipment.";
  }
}

export function updateEquipmentTable(equipment) {
  const equipmentTable = document.getElementById("equipment-table");

  equipmentTable.innerHTML = "";
  
  if (!equipmentTable) return;

  if (equipment.length === 0) {
    message.textContent = "No equipment available.";
    return;
  }

  equipment.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.brand}</td>
      <td>${item.mount}</td>
      <td>${item.focalLength}</td>
      <td>${item.aperture}</td>
      <td>${item.version}</td>
      <td>${item.status}</td>
      <td>${item.serialNumber}</td>
      <td>${item.createdBy}</td>
      <td><button class="editButton" data-id="${item._id}">Edit</button></td>
      <td><button class="deleteButton" data-id="${item._id}">Delete</button></td>
    `;
    
    row.querySelector(".editButton").addEventListener("click", () => showEditForm(item));
    row.querySelector(".deleteButton").addEventListener("click", () => deleteEquipment(item._id));
    equipmentTable.appendChild(row);
  });
}

export async function deleteEquipment(id) {
  try {
    const response = await fetch(`${API_URL}/equipment/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token()}` },
    });

    if (!response.ok) throw new Error("Failed to delete equipment");
    fetchAndDisplayEquipment();
  } catch (error) {
    console.error("Error deleting equipment:", error);
    message.textContent = "Error deleting equipment.";
  }
}

export async function showEditForm(item) {
  const editForm = document.getElementById("edit-form");
  Object.entries(item).forEach(([key, value]) => {
    const input = editForm.querySelector(`#edit-${key}`);
    if (input) input.value = value;
  });
  
  document.getElementById("edit-equipment-div").style.display = "block";
}

export async function showAddEquipmentForm() {
  document.getElementById("add-equipment-div").style.display = "block";
  
  const equipmentDiv = document.getElementById("equipment-div");
  equipmentDiv.style.display = "none";
  
  const message = document.getElementById("message");
  message.textContent = "";
  

  const formFields = ['brand', 'mount', 'focalLength', 'aperture', 'version', 'serialNumber', 'status'];
  formFields.forEach(field => {
    const input = document.getElementById(`add-${field}`);
    if (input) input.value = '';
  });
}
