// Purpose: JavaScript for equipment page.
import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
  handleLogoff,
} from "./index.js";

import { showLoginRegister } from "./loginRegister.js";
import { showWelcome } from "./welcome.js";
import { showAddEquipmentForm } from "./addEdit.js";

const API_URL = "http://localhost:5000/api/v1";

let equipmentDiv, equipmentTable;

document.addEventListener("DOMContentLoaded", () => {

  window.addEventListener("beforeunload", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));  // ✅ Resave user info
    }
  });

  enableInput(true);
  if (token) {
    showWelcome();
    showAddEquipmentForm();
    showEquipment();
  }
  else {
    showLoginRegister();
  }
  setupEventListeners();
});

export async function showEquipment() {
  equipmentDiv = document.getElementById("equipment-div");
  equipmentTable = document.getElementById("equipment-table");

  if(addEquipmentDiv.style.display !== "block") {
    setDiv(equipmentDiv);
  }
  setupEventListeners();
  await fetchAndDisplayEquipment();

}

let eventListenerSet = false;

export function setupEventListeners() {
  if (eventListenerSet) return;
  eventListenerSet = true;
  
  document.getElementById("view-all-equipment-button").addEventListener("click", (e) => {
    e.preventDefault();
    fetchAndDisplayEquipment();
  });

  document.getElementById("logoff-from-equipment-button").addEventListener("click", () => {
    showLoginRegister();
    handleLogoff();
  });

  document.getElementById("edit-equipment-button").addEventListener("click", showEditForm);
}

export async function addEquipment() {
  const brand = document.getElementById("add-brand").value;
  const mount = document.getElementById("add-mount").value;
  const focalLength = document.getElementById("add-focal-length").value;
  const aperture = document.getElementById("add-aperture").value;
  const version = document.getElementById("add-version").value;
  const serialNumber = document.getElementById("add-serial-number").value;
  const updatedBy = document.getElementById("add-updated-by").value;
  const status = document.getElementById("add-status").value;

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
