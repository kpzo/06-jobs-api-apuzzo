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
import { showAddEquipmentForm, showEditForm, updateEquipment } from "./addEdit.js";

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
    showEditEquipmentFormById();
    showEditForm();
  }
  else {
    showLoginRegister();
  }
  setupEventListeners();
});

export async function showEquipment() {
  equipmentDiv = document.getElementById("equipment-div");
  equipmentTable = document.getElementById("equipment-table");
  const addEquipmentDiv = document.getElementById("add-equipment-div");

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
 
  document.getElementById('submit-add-button').addEventListener('click', (e) => {
    e.preventDefault();
    addEquipment();
  });
  
  document.getElementById('add-equipment-button').addEventListener('click', showAddEquipmentForm);
  
  document.getElementById('go-back-button').addEventListener('click', (e) => {
    const addEquipmentDiv = document.getElementById('add-equipment-div');
    showLoginRegister();
    addEquipmentDiv.style.display = "none";
  });
  
  document.getElementById("submit-update-button").addEventListener("click", async (e) => {
    e.preventDefault();
    await updateEquipment();
    setDiv(equipmentDiv);
  });
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

  console.log("Adding equipment...");
  console.log("Stored token:", localStorage.getItem("token"));

  const authToken = localStorage.getItem("token");
  console.log('token being sent:', authToken)

  const fields = brand && mount && focalLength && aperture && version && serialNumber && updatedBy && status;

  if (!fields) {
    message.textContent = "All fields are required.";
    return;
  } 

  try {
    const response = await fetch(`${API_URL}/equipment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
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


    console.log('request headers:', response.headers)
    console.log('request status:', response.status)

    const data = await response.json();
    console.log('api response after adding equipment', data)

    if (!Array.isArray(data.equipment)) {
      console.error('addEquipment: data.equipment is not an array', data.equipment);
    } else {
      console.log('addEquipment: data.equipment is an array', data.equipment);}

    updateEquipmentTable(Array.isArray(data.equipment) ? data.equipment : [data.equipment]);
    message.textContent = "Equipment added.";
    
    document.getElementById('add-equipment-form').reset(); 
  } 
  catch (error) {
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
    console.log('equipment data:', equipment)

    updateEquipmentTable(Array.isArray(equipment) ? equipment : [equipment]);

  } catch (error) {
    console.error("Error fetching equipment:", error);
    message.textContent = "Error loading equipment.";
  }
}



export function updateEquipmentTable(equipment) {
  const equipmentTable = document.getElementById("equipment-table");
  console.log('equipment data received:', equipment)

  if (!equipment) {
    console.error("updateEquipmentTable: Invalid equipment data received:", equipment);
    return;
  }
  
  if (!Array.isArray(equipment)) {
    console.error("updateEquipmentTable: Invalid equipment data received:", equipment);
    return;
  }

  if (!equipmentTable) {
    console.error("updateEquipmentTable: No equipment table found");
    return;
  }

  if (!equipment || equipment.length === 0) {
    message.textContent = "No equipment available.";
    return;
  }

  equipmentTable.innerHTML = `
  <tr>
    <th>Brand</th>
    <th>Mount</th>
    <th>Focal Length</th>
    <th>Aperture</th>
    <th>Version</th>
    <th>Serial Number</th>
    <th>Updated By</th>
    <th>Status</th>
    <th colspan="2">Actions</th>
      </tr>
  `;

  equipment.forEach((item) => {
    if (!item || typeof item !== "object") {
      console.warn('Skipping invalid item', item)
      return;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${item.brand}</td>
    <td>${item.mount}</td>
    <td>${item.focalLength}</td>
    <td>${item.aperture}</td>
    <td>${item.version}</td>
    <td>${item.serialNumber}</td>
    <td>${item.updatedBy}</td>
    <td>${item.status}</td>
    <td><button id="edit-button" data-id="${item._id}">Edit</button></td>
    <td><button id="delete-button" data-id="${item._id}">Delete</button></td>
    `;

    row.querySelector("#edit-button").addEventListener("click", () => fetchEquipmentById(item._id));
    row.querySelector("#delete-button").addEventListener("click", () => deleteEquipment(item._id));
    
    equipmentTable.appendChild(row);
  });

  console.log('table successfully updated')
}

export async function fetchEquipmentById(id) {
  if (!id || typeof id !== "string") {
    console.error("fetchEquipmentById: Invalid ID received:", id);
    return;
  }

  console.log("Fetching equipment by ID:", id);

  try {
    const authToken = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/equipment/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!response.ok) {
      console.error("API request failed, status:", response.status);
      throw new Error("Failed to fetch equipment");
    }

    const data = await response.json();
    console.log("✅ Equipment data received:", data);

    if (!data || typeof data.equipment !== "object") {
      console.error("Invalid data format:", data);
      return;
    }

    showEditForm(data.equipment);
  } catch (error) {
    console.error("Error fetching equipment by ID:", error);
    message.textContent = "Error loading equipment.";
  }
}


export async function deleteEquipment(id) {
  try {
    const response = await fetch(`${API_URL}/equipment/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to delete equipment");
    await fetchAndDisplayEquipment();
  } catch (error) {
    console.error("Error deleting equipment:", error);
    message.textContent = "Error deleting equipment.";
  }
}