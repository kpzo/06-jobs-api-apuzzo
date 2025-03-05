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

import { showWelcome } from "./welcome.js";
import { showAddEquipmentForm, showEditForm } from "./addEdit.js";

const API_URL = "http://localhost:5000/api/v1";


document.addEventListener("DOMContentLoaded", () => {

  const equipmentDiv = document.getElementById("equipment-div");
  const addEquipmentDiv = document.getElementById("add-equipment-div");
  const backToWelcome = document.getElementById("back-to-welcome");
  const backToAllEquipment = document.getElementById("back-to-all-equipment");
  const viewEquipmentButton = document.getElementById("view-equipment-after-login-button");

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


    if (viewEquipmentButton) {
      viewEquipmentButton.removeEventListener("click", showEquipment);
      viewEquipmentButton.addEventListener("click", showEquipment);
  }

  if (backToAllEquipment) {
      backToAllEquipment.removeEventListener("click", showEquipment);
      backToAllEquipment.addEventListener("click", showEquipment);
  }

  setupEventListeners();
});



export async function showEquipment() {
  console.log("🔄 Loading equipment list...");

  const equipmentDiv = document.getElementById("equipment-div");
  const addEquipmentDiv = document.getElementById("add-equipment-div");
  const editEquipmentDiv = document.getElementById("edit-equipment-div");
  const welcomeDiv = document.getElementById("welcome-div");

  // Hide all other views
  welcomeDiv.style.display = "none";
  addEquipmentDiv.style.display = "none";
  editEquipmentDiv.style.display = "none";

  // Show the Equipment List
  equipmentDiv.style.display = "block";

  // Fetch and display the latest equipment list
  await fetchAndDisplayEquipment();
}





export function setupEventListeners() {
  console.log("Setting up event listeners...");

  const welcomeViewEquipmentButton = document.getElementById('view-equipment-after-login-button');
  const welcomeAddEquipmentButton = document.getElementById('add-equipment-after-login-button');
  const logoutFromWelcomeButton = document.getElementById('logoff-button');
  const requestAccessButton = document.getElementById('request-access-button');

  if (!welcomeViewEquipmentButton || !welcomeAddEquipmentButton || !logoutFromWelcomeButton || !requestAccessButton) {
      console.error("One or more welcome buttons not found!");
      return;
  }

  welcomeViewEquipmentButton.addEventListener('click', (e) => {
      e.preventDefault();
      console.log("View Equipment button clicked");
      setDiv(document.getElementById('equipment-div'));
      fetchAndDisplayEquipment();
  });

  welcomeAddEquipmentButton.addEventListener('click', (e) => {
      e.preventDefault();
      console.log("Add Equipment button clicked");
      setDiv(document.getElementById('add-equipment-div'));
      showAddEquipmentForm();
      document.getElementById('welcome-div').style.display = 'none';
  });

  logoutFromWelcomeButton.addEventListener('click', (e) => {
      e.preventDefault();
      console.log("Logout button clicked");
      handleLogoff();
  });

  requestAccessButton.addEventListener('click', (e) => {
      e.preventDefault();
      console.log("Request Access button clicked");
      requestAccess();
  });
}



export async function addEquipment(fields) {
  const message = document.getElementById("equipment-message");

  console.log("Adding equipment...");

  const authToken = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const createdBy = user ? user._id : null;
  console.log("User ID:", createdBy);  
  console.log("Token being sent:", authToken);

  if (!authToken || !createdBy) {
    console.error("No token or user ID found.");
    message.textContent = "You need to log in to add equipment.";
    return;
  }

  // Create an object from the form inputs
  const equipmentData = { ...fields, createdBy };

  try {
    const response = await fetch(`${API_URL}/equipment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(equipmentData),
    });

    const responseText = await response.text();
    console.log("API response text:", responseText);
    
    if (!response.ok) {
      console.error("API request failed, status:", response.status);
      throw new Error(responseText);
    }
    
    const data = JSON.parse(responseText);
    console.log("Equipment added successfully", data);
    message.textContent = "Equipment added successfully.";
    return data;
  } catch (error) {
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

  const token = localStorage.getItem("token");
  if (!token) {
      console.error("No token found. User is not authenticated.");
      equipmentMessage.textContent = "You need to log in to view equipment.";
      return;
  }

  try {
      const response = await fetch(`${API_URL}/equipment`, {
          headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
          console.error("API request failed, status:", response.status);
          equipmentMessage.textContent = "Error loading equipment.";
          return;
      }

      const responseText = await response.text(); // Read response as plain text
      console.log("Raw API Response:", responseText);

      let jsonData;
      try {
          jsonData = JSON.parse(responseText);
          console.log("Parsed JSON Response:", jsonData);
      } catch (error) {
          console.error("Error parsing JSON:", error);
          equipmentMessage.textContent = "Error parsing equipment data.";
          return;
      }

      // Ensure `equipment` exists in response
      let equipment = jsonData.responseData || []; 

      if (!equipment || equipment.length === 0) {
          console.warn("No equipment data found in API response.");
          equipmentMessage.textContent = "No equipment available.";
          return;
      }

      if (!Array.isArray(equipment)) {
          console.warn("API response is not an array, converting to array:", equipment);
          equipment = [equipment];
      }

      console.log("Equipment data received:", equipment);
      updateEquipmentTable(equipment);

      editEquipmentDiv.style.display = "none";
      equipmentDiv.style.display = "block";

  } catch (error) {
      console.error("Error fetching equipment:", error);
      equipmentMessage.textContent = "Error loading equipment.";
  }
}





export async function updateEquipmentTable(equipmentId) {
  enableInput(true);

  // Ensure equipmentMessage is defined
  const equipmentMessage = document.getElementById("edit-equipment-message");
  if (!equipmentMessage) {
    console.error("edit-equipment-message element not found!");
    return;
  }

  const authToken = localStorage.getItem("token");
  if (!authToken) {
    console.error("No token found. User not authenticated.");
    equipmentMessage.textContent = "Authentication required to update equipment.";
    return;
  }

  // Ensure equipmentId exists
  if (!equipmentId || typeof equipmentId !== 'string') {
    console.error("Missing equipment ID for update.", equipmentId);
    equipmentMessage.textContent = "Error: Missing equipment ID.";
    return;
    }
    // Retrieve updated values from the form
    const updatedByInput = document.getElementById("edit-updated-by").value;
    const statusInput = document.getElementById("edit-status").value;
    const remarksInput = document.getElementById("edit-remarks").value;

    if (!updatedByInput || !statusInput) {
    console.error("One or more form fields not found in DOM.");
    equipmentMessage.textContent = "Error: Form fields missing.";
    return;
    }

    // Construct the payload to send in the request
    const updatePayload = { updatedByInput, statusInput, remarksInput };
  console.log("📤 Sending update request with data:", updatePayload);

  try {
    const response = await fetch(`${API_URL}/equipment/${equipmentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(updatePayload),
    });

    const responseText = await response.text(); // Read response as plain text for debugging
    console.log("📩 Raw API Response:", responseText);

    if (!response.ok) {
      console.error("API request failed, status:", response.status);
      equipmentMessage.textContent = `Error updating equipment: ${responseText}`;
      return;
    }

    const data = JSON.parse(responseText);
    console.log("Equipment updated successfully:", data);
    equipmentMessage.textContent = "Equipment updated successfully.";

    // Refresh equipment list after update
    await fetchAndDisplayEquipment();
    setDiv(document.getElementById("equipment-div")); // Navigate back to the equipment list

  } catch (error) {
    console.error("Error updating equipment:", error);
    equipmentMessage.textContent = "Error updating equipment. Please try again.";
  }

  // ----------- TABLE UPDATE LOGIC STARTS HERE -----------
  const equipmentTable = document.getElementById("equipment-table");

  if (!equipmentTable) {
    console.error("updateEquipmentTable: No equipment table found");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user ? user.role : "user";

  console.log("Updating Equipment Table...");

  // Clear table and add headers
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
      ${userRole !== "user" ? "<th colspan='2'>Actions</th>" : ""}
    </tr>
  `;

  const equipmentData = await fetchAllEquipment(); // Fetch latest equipment data

  equipmentData.forEach((item) => {
    if (!item || typeof item !== "object" || !item._id) {
      console.warn("Skipping invalid item:", item);
      return;
    }

    // Ensure default values if missing
    const updatedBy = item.updatedBy ? item.updatedBy : "Unknown";
    const status = item.status ? item.status : "N/A";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.brand || "N/A"}</td>
      <td>${item.mount || "N/A"}</td>
      <td>${item.focalLength || "N/A"}</td>
      <td>${item.aperture || "N/A"}</td>
      <td>${item.version || "N/A"}</td>
      <td>${item.serialNumber || "N/A"}</td>
      <td>${updatedBy}</td>
      <td>${status}</td>
      ${
        userRole !== "user"
          ? `
        <td><button class="edit-button" data-id="${item._id}">Edit</button></td>
        <td><button class="delete-button" data-id="${item._id}">Delete</button></td>
      `
          : ""
      }
    `;

    equipmentTable.appendChild(row);

    // Attach event listeners for Edit & Delete buttons
    const editButton = row.querySelector(".edit-button");
    if (editButton) {
      editButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const equipmentId = e.target.dataset.id;
        console.log("Edit Button Clicked - Equipment ID:", equipmentId);

        const equipmentData = await fetchEquipmentById(equipmentId);
        if (!equipmentData) {
          console.error("Error: Could not load equipment data.");
          return;
        }

        showEditForm(equipmentData);
      });
    }

    const deleteButton = row.querySelector(".delete-button");
    if (deleteButton) {
      deleteButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const equipmentId = e.target.dataset.id;
        console.log("Delete equipment ID:", equipmentId);

        const confirmed = confirm("Are you sure you want to delete this equipment?");
        if (confirmed) {
          await deleteEquipment(equipmentId);
          await fetchAndDisplayEquipment();
        }
      });
    }
  });

  console.log("Equipment table successfully updated.");
}






export async function fetchEquipmentById(equipmentId) {
  if(!equipmentId) {
    console.error('fetchEquipmentById: missing equipmentId')
    return null;
  }

  const authToken = localStorage.getItem("token");
  if (!authToken) {
      console.error("No token found. User is not authenticated.");
      equipmentMessage.textContent = "You need to log in to view equipment.";
      return;
  }
  
  try {
    const response = await fetch(`${API_URL}/equipment/${equipmentId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${authToken}` }
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
  const authToken = localStorage.getItem("token");
  if (!authToken) {
      console.error("No token found. User is not authenticated.");
      return;
  }

  try {
      const response = await fetch(`${API_URL}/equipment/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) throw new Error("Failed to delete equipment");

      await fetchAndDisplayEquipment();
  } catch (error) {
      console.error("Error deleting equipment:", error);
      message.textContent = "Error deleting equipment.";
  }
}
