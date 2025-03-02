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
import { showAddEquipmentForm, showEditForm } from "./addEdit.js";

const API_URL = "http://localhost:5000/api/v1";

let equipmentDiv;

document.addEventListener("DOMContentLoaded", () => {

  window.addEventListener("beforeunload", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));  // ✅ Resave user info
    }
  });

  document.getElementById("equipment-table").addEventListener("click", async (e) => {
    if (e.target.id === "edit-button") {
      console.log("🛠️ Edit button clicked, fetching equipment...");
      
      const equipmentId = e.target.dataset.id;
      const equipmentData = await fetchEquipmentById(equipmentId);
      
      if (equipmentData) {
        console.log("✅ Equipment Data Retrieved:", equipmentData);
        showEditForm(equipmentData);
      } else {
        console.error("❌ Error: Could not load equipment data.");
      }
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
  const equipmentDiv = document.getElementById("equipment-div");
  const message = document.getElementById("equipment-message");
  const equipmentTable = document.getElementById("equipment-table");
  const addEquipmentDiv = document.getElementById("add-equipment-div");
  const editEquipmentDiv = document.getElementById("edit-equipment-div");

  try {
    const response = await fetch(`${API_URL}/equipment`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch equipment");

    let { equipment } = await response.json();
    if (!Array.isArray(equipment)) {
      equipment = [equipment];  // Ensure it's always an array
    }

    console.log('Equipment data received:', equipment);

    if (equipment.length === 0) {
      console.warn("⚠️ No equipment found.");
      if (message) message.textContent = "No equipment available.";
      return;
    }

    updateEquipmentTable(equipment); // Update the table with the fetched equipment

  } catch (error) {
    console.error("❌ Error fetching equipment:", error);
    if (message) message.textContent = "Error loading equipment.";
  }
  
  // Hide add & edit forms, show equipment list
  addEquipmentDiv.style.display = "none";
  editEquipmentDiv.style.display = "none";
  equipmentDiv.style.display = "block";
  equipmentTable.style.display = "block";
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
  
  document.getElementById('add-equipment-button').addEventListener('click', showAddEquipmentForm);
  
  document.getElementById('go-back-button').addEventListener('click', (e) => {
    const addEquipmentDiv = document.getElementById('add-equipment-div');
    showLoginRegister();
    addEquipmentDiv.style.display = "none";
  });
}




export async function addEquipment(equipmentId) {
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

    let { equipment } = await response.json();
    if (!Array.isArray(equipment)) {
      equipment = [equipment];
    }
    console.log('equipment data:', equipment)

    updateEquipmentTable(Array.isArray(equipment) ? equipment : [equipment]);

  } catch (error) {
    console.error("Error fetching equipment:", error);
    message.textContent = "Error loading equipment.";
  }
}




export function updateEquipmentTable(equipment) {
  
  const equipmentTable = document.getElementById("equipment-table");
  const message = document.getElementById("message");
  console.log('equipment data received:', equipment);

  if (!equipmentTable) {
    console.error("updateEquipmentTable: No equipment table found");
    return;
  }

  if (!equipment || !Array.isArray(equipment)) {
    console.error("updateEquipmentTable: Invalid equipment data received:", equipment);
    message.textContent = "Invalid equipment data.";
    return;
  }

  if (equipment.length === 0) {
    message.textContent = "No equipment available.";
    return;
  }

  // clear tables and add headers
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
      console.warn('Skipping invalid item', item);
      return;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.brand || "N/A"}</td>
      <td>${item.mount || "N/A"}</td>
      <td>${item.focalLength || "N/A"}</td>
      <td>${item.aperture || "N/A"}</td>
      <td>${item.version || "N/A"}</td>
      <td>${item.serialNumber || "N/A"}</td>
      <td>${item.updatedBy || "N/A"}</td>
      <td>${item.status || "N/A"}</td>
      <td><button class="edit-button" data-id="${item._id}">Edit</button></td>
      <td><button class="delete-button" data-id="${item._id}">Delete</button></td>
    `;


    row.querySelector(".edit-button").addEventListener("click", async (e) => {
      const equipmentId = e.target.dataset.id;
      console.log("✅ Edit Button Clicked - Equipment ID:", equipmentId);

      const equipmentData = await fetchEquipmentById(equipmentId);

      if (!equipmentData) {
        console.error("❌ Error: Could not load equipment data.");
        return;
      }

      console.log("✅ Calling showEditForm()...");
      showEditForm(equipmentData);
    });

    row.querySelector(".delete-button").addEventListener("click", async (e) => {
    const equipmentId = e.target.dataset.id;
    console.log('delete equipment id:', equipmentId)
    await deleteEquipment(equipmentId);
    await fetchAndDisplayEquipment();
  })

  equipmentTable.appendChild(row);
})
  console.log('table successfully updated');
}




export async function fetchEquipmentById(equipmentId) {
  if(!equipmentId) {
    console.error('fetchEquipmentById: missing equipmentId')
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/equipment/${equipmentId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })

    if (!response.ok) {
      console.error("API request failed, status:", response.status);
      throw new Error("Failed to fetch equipment");
    }

    const equipmentData = await response.json();
    console.log("✅ Equipment data received:", equipmentData);

    if (!equipmentData || typeof equipmentData !== "object") {
      console.error("No equipment data received");
      return;
    }

    return equipmentData;
  } catch (error) {
    console.error("Error fetching equipment by ID:", error);
    message.textContent = "Error loading equipment.";
    return null;
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