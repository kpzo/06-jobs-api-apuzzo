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


document.addEventListener("DOMContentLoaded", () => {

  const equipmentDiv = document.getElementById("equipment-div");
  const addEquipmentDiv = document.getElementById("add-equipment-div");
  const welcomeDiv = document.getElementById("welcome-div");
  const backToWelcome = document.getElementById("back-to-welcome");
  const backToAllEquipment = document.getElementById("back-to-all-equipment");
  const addEquipmentButton = document.getElementById("add-equipment-button");

  window.addEventListener("beforeunload", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));  // ✅ Resave user info
    }
  });

  backToWelcome.addEventListener('click', (e) => {
    const equipmentDiv = document.getElementById('equipment-div');
    e.preventDefault();
    equipmentDiv.style.display = 'none';
    showWelcome();
  });

  backToAllEquipment.addEventListener('click', (e) => {  
    e.preventDefault();
    console.log('back to equipment button from add page clicked');
    setDiv(equipmentDiv);
    showEquipment();
    addEquipmentDiv.style.display = 'none';
  });

  addEquipmentButton.addEventListener('click', (e) => {
    e.preventDefault();
    showAddEquipmentForm();
    welcomeDiv.style.display = "none";
  });
});



export async function showEquipment() {
  const equipmentDiv = document.getElementById("equipment-div");
  const editEquipmentDiv = document.getElementById("edit-equipment-div");

  if (editEquipmentDiv.style.display === "block") {
    return;
  }

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
    updateEquipmentTable(equipment);

  } catch (error) {
    console.error("Error fetching equipment:", error);
    if (message) message.textContent = "Error loading equipment.";
  }
  
  // Hide edit forms, show equipment list
  editEquipmentDiv.style.display = "none";
  equipmentDiv.style.display = "block";
}




let eventListenerSet = false;

export function setupEventListeners() {
  if (eventListenerSet) return;
  eventListenerSet = true;
  

  document.getElementById("logoff-from-equipment-button").addEventListener("click", () => {
    showLoginRegister();
    handleLogoff();
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

  const equipmentDiv = document.getElementById("equipment-div");
  const welcomeDiv = document.getElementById("welcome-div");
  const equipmentMessage = document.getElementById("equipment-message");
  const editEquipmentDiv = document.getElementById("edit-equipment-div");


  welcomeDiv.style.display = "none";
  equipmentDiv.style.display = "block";

  try {
    const response = await fetch(`${API_URL}/equipment`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error("API request failed, status:", response.status);
      return;
    }


    const { equipment } = await response.json();
    if (!Array.isArray(equipment)) {
      equipment = [equipment];
    }
    console.log('equipment data:', equipment)

    updateEquipmentTable(equipment);

    editEquipmentDiv.style.display = "none";
    equipmentDiv.style.display = "block";

  } catch (error) {
    console.error("Error fetching equipment:", error);
    equipmentMessage.textContent = "Error loading equipment.";
  }
}




export function updateEquipmentTable(equipment) {
  const equipmentTable = document.getElementById("equipment-table");
  const message = document.getElementById("message");
  const welcomeAddEquipmentButton = document.getElementById("add-equipment-button");
  const backToWelcomeButton = document.getElementById("back-to-welcome");


  if (backToWelcomeButton) {
    backToWelcomeButton.style.display = "block";
  }
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

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user ? user.role : "user";
  console.log('user role in table:', userRole);

  if (userRole === 'user' && welcomeAddEquipmentButton) {
    welcomeAddEquipmentButton.style.display = "none";
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
    ${userRole === 'user' ? '' : "<th colspan='2'>Actions</th>"}
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
      ${
        userRole === 'user'
        ? ''
        : `
      <td><button class="edit-button" data-id="${item._id}">Edit</button></td>
      <td><button class="delete-button" data-id="${item._id}">Delete</button></td>
      `
    }`;

    if (userRole !== 'user') {
    row.querySelector(".edit-button").addEventListener("click", async (e) => {
      const welcomeDiv = document.getElementById("welcome-div");
      const editEquipmentDiv = document.getElementById("edit-equipment-div");
      const equipmentDiv = document.getElementById("equipment-div");
      const equipmentId = e.target.dataset.id;

      console.log("Edit Button Clicked - Equipment ID:", equipmentId);

      welcomeDiv.style.display = "none";
      editEquipmentDiv.style.display = "block";
      equipmentDiv.style.display = "none";

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
      alert("Are you sure you want to delete this equipment?");
      await deleteEquipment(equipmentId);
      await fetchAndDisplayEquipment();
    })
  }

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