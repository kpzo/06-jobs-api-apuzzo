
import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { fetchAndDisplayEquipment, addEquipment, fetchEquipmentById, deleteEquipment, showEquipment, setupEventListeners } from "./equipment.js";


const API_URL = "http://localhost:5000/api/v1";

function setupAddEventListeners() {
  console.log("Setting up event listeners...");

  // Ensure DOM elements exist before adding event listeners
  const deleteEquipmentButton = document.getElementById("delete-equipment-button");
  const submitUpdateButton = document.getElementById("submit-update-button");
  const submitAddButton = document.getElementById("submit-add-button");
  const backToEquipmentButton = document.getElementById("back-to-equipment-button");
  const equipmentDiv = document.getElementById("equipment-div");
  const addEquipmentDiv = document.getElementById("add-equipment-div");

  // Delete Equipment Button
  if (deleteEquipmentButton) {
      deleteEquipmentButton.removeEventListener("click", deleteEquipmentHandler);
      deleteEquipmentButton.addEventListener("click", deleteEquipmentHandler);
  }

  // Update Equipment Button
  if (submitUpdateButton) {
      submitUpdateButton.removeEventListener("click", updateEquipmentHandler);
      submitUpdateButton.addEventListener("click", updateEquipmentHandler);
  }

  // Add Equipment Button
  if (submitAddButton) {
      submitAddButton.removeEventListener("click", addEquipmentHandler);
      submitAddButton.addEventListener("click", addEquipmentHandler);
  }

  // Back to Equipment Button
  if (backToEquipmentButton) {
      backToEquipmentButton.removeEventListener("click", backToEquipmentHandler);
      backToEquipmentButton.addEventListener("click", backToEquipmentHandler);
  }

  // Handle dynamically added buttons in `equipmentDiv`
  if (equipmentDiv) {
      equipmentDiv.removeEventListener("click", handleDynamicButtonClicks);
      equipmentDiv.addEventListener("click", handleDynamicButtonClicks);
  }

  console.log("✅ Event listeners set up successfully.");
}

// Ensure event listeners run after any page changes
document.addEventListener("DOMContentLoaded", () => {
  setupAddEventListeners();
});

// Delete Equipment Handler
async function deleteEquipmentHandler(e) {
  e.preventDefault();
  const confirmed = confirm("Are you sure you want to delete this equipment?");
  if (confirmed) {
      const equipmentId = document.getElementById("edit-form").dataset.equipmentId;
      if (!equipmentId) {
          console.error("No equipment ID found.");
          return;
      }
      await deleteEquipment(equipmentId);
      fetchAndDisplayEquipment();
  }
}

// Update Equipment Handler
async function updateEquipmentHandler(e) {
  e.preventDefault();
  enableInput(true);

  const equipmentId = document.getElementById("edit-form").dataset.equipmentId;
  if (!equipmentId) {
      console.error("Missing equipment ID.");
      return;
  }

  console.log("🔄 Updating equipment with ID:", equipmentId);
  await updateEquipment(equipmentId);
  document.getElementById("equipment-message").textContent = "Equipment updated successfully.";
}

// Add Equipment Handler
async function addEquipmentHandler(e) {
  e.preventDefault();
  enableInput(true);

  const brand = document.getElementById("add-brand").value.trim();
  const mount = document.getElementById("add-mount").value.trim();
  const focalLength = document.getElementById("add-focal-length").value.trim();
  const aperture = document.getElementById("add-aperture").value.trim();
  const version = document.getElementById("add-version").value.trim();
  const serialNumber = document.getElementById("add-serial-number").value.trim();
  const updatedBy = document.getElementById("add-updated-by").value.trim();
  const status = document.getElementById("add-status").value;
  const addEquipmentMessage = document.getElementById("add-equipment-message");

  if (!brand || !mount || !focalLength || !aperture || !version || !serialNumber || !updatedBy || !status) {
      addEquipmentMessage.textContent = "Please fill in all required fields.";
      return;
  }

  try {
      await addEquipment({ brand, mount, focalLength, aperture, version, serialNumber, updatedBy, status });
      addEquipmentMessage.textContent = "✅ Equipment added successfully!";
      fetchAndDisplayEquipment();
      document.getElementById("add-equipment-form").reset();
      document.getElementById("add-equipment-div").style.display = "none";
  } catch (error) {
      addEquipmentMessage.textContent = "Error adding equipment.";
      console.error("Error:", error);
  }
}

// Back to Equipment Handler
function backToEquipmentHandler(e) {
  e.preventDefault();
  console.log("⬅️ Returning to equipment list...");
  setDiv(document.getElementById("equipment-div"));
}


export const showAddEquipmentForm = () => {
  console.log("Showing add equipment form...");

  const addEquipmentDiv = document.getElementById("add-equipment-div");  
  const addEquipmentForm = document.getElementById("add-equipment-form");
  const equipmentDiv = document.getElementById("equipment-div");

  addEquipmentDiv.style.display = "block";
  equipmentDiv.style.display = "none";
  addEquipmentForm.style.display = "block";

  addEquipmentForm.reset();
};



function handleDynamicButtonClicks(e) {
  if (!e.target || !e.target.matches("button")) return;

  e.preventDefault();

  // Handle Edit Button
  if (e.target.classList.contains("edit-button")) {
      const equipmentId = e.target.dataset.id;
      if (!equipmentId) {
          console.error("Missing equipment ID.");
          return;
      }

      console.log("Editing equipment ID:", equipmentId);
      fetchEquipmentById(equipmentId).then((equipmentItem) => {
          if (!equipmentItem) {
              return (document.getElementById("equipment-message").textContent = "Error fetching equipment.");
          }

          showEditForm(equipmentItem);
          setDiv(document.getElementById("edit-equipment-div"));
      });
  }

  // Handle Delete Button
  if (e.target.classList.contains("delete-button")) {
      const confirmed = confirm("Are you sure you want to delete this equipment?");
      if (confirmed) {
          const equipmentId = e.target.dataset.id;
          console.log("Deleting equipment ID:", equipmentId);
          deleteEquipment(equipmentId).then(fetchAndDisplayEquipment);
      }
  }
}




export async function showEditForm(equipmentData) {
  console.log("Showing edit equipment form...", equipmentData);
  enableInput(true);

  if (document.readyState === "loading") {
    console.warn("⚠️ DOM not ready yet. Waiting...");
    await new Promise((resolve) => document.addEventListener("DOMContentLoaded", resolve));
  }

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user ? user.role : 'user';

  const equipment = equipmentData.equipment || equipmentData;

  // Get Elements
  const editEquipmentDiv = document.getElementById("edit-equipment-div");
  const welcomeAddEquipmentButton = document.getElementById("add-equipment-after-login-button");
  const editForm = document.getElementById("edit-form");
  const equipmentDiv = document.getElementById("equipment-div");

  editForm.dataset.equipmentId = equipmentData._id || "";

  if (userRole === 'user' && welcomeAddEquipmentButton) {
    welcomeAddEquipmentButton.style.display = 'none';
  }

  // Non-editable fields (Static Text)
  const brandText = document.getElementById("edit-brand-text");
  const mountText = document.getElementById("edit-mount-text");
  const focalLengthText = document.getElementById("edit-focal-length-text");
  const apertureText = document.getElementById("edit-aperture-text");
  const versionText = document.getElementById("edit-version-text");
  const serialNumberText = document.getElementById("edit-serial-number-text");
  const updatedAtText = document.getElementById("edit-updated-at-text");
  const formattedDate = new Date(equipment.updatedAt).toLocaleString();


  // Editable fields (Inputs)
  const updatedByInput = document.getElementById("edit-updated-by");
  const statusInput = document.getElementById("edit-status");
  const remarksInput = document.getElementById("edit-remarks");

  console.log("Assigning values to form fields:", equipment);


  // Show form and hide equipment list
  equipmentDiv.style.display = "none";
  editEquipmentDiv.style.display = "block";
  

  setTimeout(() => {
    if (equipment) {
      console.log("Equipment data received:", equipment);

      // Check if equipment object has the expected properties
      if (!equipment.brand || !equipment.mount || !equipment.focalLength || !equipment.aperture || !equipment.version || !equipment.serialNumber) {
        console.error("Equipment object is missing some properties:", equipment);
        return;
      }

      // Assign values to static text fields
      if (brandText) brandText.textContent = equipment.brand || "N/A";
      if (mountText) mountText.textContent = equipment.mount || "N/A";
      if (focalLengthText) focalLengthText.textContent = equipment.focalLength || "N/A";
      if (apertureText) apertureText.textContent = equipment.aperture || "N/A";
      if (versionText) versionText.textContent = equipment.version || "N/A";
      if (serialNumberText) serialNumberText.textContent = equipment.serialNumber || "N/A";
      if (updatedAtText) updatedAtText.textContent = formattedDate || "N/A";

      // Assign values to editable fields
      if (updatedByInput) updatedByInput.value = equipment.updatedBy || "";
      if (statusInput) statusInput.value = equipment.status || "available";
      if (remarksInput) remarksInput.value = equipment.remarks || "";

      editForm.dataset.equipmentId = equipment._id;
    } else {
      console.error("Error populating edit form.");
    }
  }, 500);
}



export const updateEquipment = async (equipmentId) => {
  enableInput(true);

  const editEquipmentMessage = document.getElementById("edit-equipment-message");
  const equipmentData = document.getElementById("edit-form").dataset.equipmentId;
  console.log('equipmentData', equipmentData)

  if(!equipmentData) {
    console.error('missing equipmentId in updateEquipment function')
    return
  }

  const updatedBy = document.getElementById("edit-updated-by").value;
  const status = document.getElementById("edit-status").value;
  const remarks = document.getElementById("edit-remarks").value;

  if (!updatedBy || !status) {
    editEquipmentMessage.textContent = "Please fill in all required fields.";
    return;
  }

  console.log("Updating equipment...");

  try {
    const response = await fetch(`${API_URL}/equipment/${equipmentData}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ 
        updatedBy, 
        status, 
        remarks }),
    });

    if (!response.ok) throw new Error("Failed to update equipment");

    console.log("✅ Equipment updated successfully.");
    await fetchAndDisplayEquipment();
    setDiv(document.getElementById("equipment-div"));
    equipmentMessage.textContent = "Equipment updated successfully.";

  } catch (error) {
    equipmentMessage.textContent = "Error updating equipment.";
  }
}

