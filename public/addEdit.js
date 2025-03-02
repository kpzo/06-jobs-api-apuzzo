
import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { fetchAndDisplayEquipment, addEquipment, fetchEquipmentById, deleteEquipment, showEquipment } from "./equipment.js";
import { showWelcome } from "./welcome.js";

const API_URL = "http://localhost:5000/api/v1";

document.addEventListener("DOMContentLoaded", () => {
const welcomeAddEquipmentButton = document.getElementById("add-equipment-after-login-button");
const addEquipmentDiv = document.getElementById("add-equipment-div");
const welcomeDiv = document.getElementById("welcome-div");
const goBackButton = document.getElementById("go-back-button");
const submitAddButton = document.getElementById("submit-add-button");
const equipmentDiv = document.getElementById("equipment-div");
const editEquipmentDiv = document.getElementById("edit-equipment-div");
const equipmentMessage = document.getElementById("equipment-message");
const userRole = JSON.parse(localStorage.getItem("user")).role;
const viewAllEquipmentButton = document.getElementById("view-all-equipment-button");
const submitUpdateButton = document.getElementById("submit-update-button");
const deleteEquipmentButton = document.getElementById("delete-equipment-button");
const editCancelButton = document.getElementById("edit-cancel-button");
const backToEquipmentButton = document.getElementById("back-to-equipment-button");

  window.addEventListener("beforeunload", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));  // ✅ Resave user info
    }
  });

  editCancelButton.addEventListener("click", (e) => {
    e.preventDefault();
    setDiv(equipmentDiv);
  });

  deleteEquipmentButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const confirmed = confirm("Are you sure you want to delete this equipment?");
    if (confirmed) {
      await deleteEquipment();
    }
  })

  submitUpdateButton.addEventListener("click", async (e) => {
    e.preventDefault()
    enableInput(true);

    if (submitUpdateButton) {
    console.log('submitUpdateButton clicked')
    await (updateEquipment())
    } else {
      equipmentMessage.textContent = "Please fill in all required fields.";
    }
  });

  viewAllEquipmentButton.addEventListener("click", (e) => {
    e.preventDefault();
    showEquipment();
  });

  welcomeAddEquipmentButton.addEventListener("click", async (e) => {
    e.preventDefault();
    showAddEquipmentForm();
  });

  submitAddButton.addEventListener("click", async (e) => {
    e.preventDefault();
    enableInput(true);
    const brand = document.getElementById("add-brand").value;
    const mount = document.getElementById("add-mount").value;
    const focalLength = document.getElementById("add-focal-length").value;
    const aperture = document.getElementById("add-aperture").value;
    const version = document.getElementById("add-version").value;
    const serialNumber = document.getElementById("add-serial-number").value;
    const updatedBy = document.getElementById("add-updated-by").value;
    const status = document.getElementById("add-status").value;

    const fields = brand && mount && focalLength && aperture && version && serialNumber && updatedBy && status;
    if (fields) {
      await addEquipment();
      fetchAndDisplayEquipment();
    } else {
      message.textContent = "Please fill in all required fields.";
    }
  });
  
  backToEquipmentButton.addEventListener("click", (e) => {
    e.preventDefault();
    console.log('back to equipment button clicked')
    showEquipment();
  });

  addEquipmentDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      enableInput(false);
    }
  });

  equipmentDiv.addEventListener("click", async (e) => {
    if (!e.target || !e.target.matches("button")) return;
  
    e.preventDefault(); // Prevent default button behavior
  

    // EDIT BUTTON LOGIC
    if (e.target.id === "edit-button") {
      console.log('edit button clicked', e.target)
      const equipmentId = e.target.dataset.id;
      console.log('data-id', e.target.dataset.id)

      if (!equipmentId) {
        console.error("Missing equipment ID in edit button event listener.");
        return;
      }

      console.log('edit button clicked for equipmentId:', equipmentId)

        try {
          const equipmentItem = await fetchEquipmentById(equipmentId);
          if (!equipmentItem) {
            return message.textContent = "Error fetching equipment.";
          }
          
          console.log('equipmentItem loaded for editing:', equipmentItem)
          showEditForm(equipmentItem);
        } catch (error) {
          message.textContent = "Error fetching equipment. Please try again.";
        }
      }
  
    // DELETE BUTTON LOGIC
    if (e.target.id === "delete-button") {
      if (userRole === "admin" || userRole === "staff") {
        const confirmed = confirm("Are you sure you want to delete this equipment?");
        if (confirmed) {
          try {
            const equipmentId = e.target.dataset.id;
            console.log("📌 Deleting equipment with ID:", equipmentId);
            const response = await fetch(`${API_URL}/equipment/${equipmentId}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
  
            if (!response.ok) throw new Error("Failed to delete equipment");
  
            console.log("✅ Equipment deleted successfully.");
            fetchAndDisplayEquipment();
            equipmentMessage.textContent = "Equipment deleted successfully.";
          } catch (error) {
            console.error("❌ Error deleting equipment:", error);
            equipmentMessage.textContent = "Error deleting equipment.";
          }
        }
      } else {
        alert("You must be an admin or staff to delete equipment.");
      }
    }
  });
})


export const showAddEquipmentForm = () => {
  console.log("Showing add equipment form...");

  const addEquipmentDiv = document.getElementById("add-equipment-div");  
  const addEquipmentForm = document.getElementById("add-equipment-form");
  const equipmentDiv = document.getElementById("equipment-div");

  addEquipmentDiv.style.display = "block";
  equipmentDiv.style.display = "none";
  addEquipmentForm.style.display = "block";

  addEquipmentForm.reset();
  message.textContent = "";
};


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

  console.log("🔹 Assigning values to form fields:", equipment);


  // Show form and hide equipment list
  equipmentDiv.style.display = "none";
  editEquipmentDiv.style.display = "block";
  

  setTimeout(() => {
    if (equipment) {
      console.log("✅ Equipment data received:", equipment);

      // Check if equipment object has the expected properties
      if (!equipment.brand || !equipment.mount || !equipment.focalLength || !equipment.aperture || !equipment.version || !equipment.serialNumber) {
        console.error("❌ Equipment object is missing some properties:", equipment);
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
      console.error("❌ Error populating edit form.");
    }
  }, 500);
}



export const updateEquipment = async (equipmentId) => {
  enableInput(true);

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
    message.textContent = "Please fill in all required fields.";
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

