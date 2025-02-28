
import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { fetchAndDisplayEquipment, addEquipment, updateEquipmentTable, fetchEquipmentById } from "./equipment.js";
import { showWelcome } from "./welcome.js";

let brand = document.getElementById("edit-brand");
let status = document.getElementById("edit-status");
let mount = document.getElementById("edit-mount");
let focalLength = document.getElementById("edit-focal-length");
let aperture = document.getElementById("edit-aperture");
let version = document.getElementById("edit-version");
let serialNumber = document.getElementById("edit-serial-number");
let updatedBy = document.getElementById("edit-updated-by");

const API_URL = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", () => {
const welcomeAddEquipmentButton = document.getElementById("add-equipment-after-login-button");
const addEquipmentDiv = document.getElementById("add-equipment-div");
const welcomeDiv = document.getElementById("welcome-div");
const goBackButton = document.getElementById("go-back-button");
const submitAddButton = document.getElementById("submit-add-button");
const equipmentDiv = document.getElementById("equipment-div");
const userRole = JSON.parse(localStorage.getItem("user")).role;

  window.addEventListener("beforeunload", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));  // ✅ Resave user info
    }
  });

  welcomeAddEquipmentButton.addEventListener("click", async (e) => {
    e.preventDefault();
    showAddEquipmentForm();
  });

  submitAddButton.addEventListener("click", async (e) => {
    e.preventDefault();
    enableInput(true);
    const fields = brand && mount && focalLength && aperture && version && serialNumber && updatedBy && status;
    if (fields) {
      await addEquipment();
    } else {
      message.textContent = "Please fill in all required fields.";
    }
  });

  goBackButton.addEventListener("click", (e) => {
    e.preventDefault();
    setDiv(welcomeDiv);
    showWelcome();
  });

  addEquipmentDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      enableInput(false);
    }
  });

  equipmentDiv.addEventListener("click", async (e) => {
    // Ensure the event target is a button
    if (!e.target || !e.target.matches("button")) return;
  
    e.preventDefault(); // Prevent default button behavior
  
    // Extract equipment ID
    const itemId = e.target.dataset.id;

    if (!itemId) {
      console.error("❌ Error: Missing equipment ID in dataset.");
      return;
    }
  
    console.log("📌 Clicked button ID:", e.target.id, " | Equipment ID:", itemId);
  
    // ✅ EDIT BUTTON LOGIC
    if (e.target.id === "edit-button") {
      if (userRole === "admin" || userRole === "staff") {
        try {
          console.log("📌 Fetching equipment with ID:", itemId);
          const equipmentItem = await fetchEquipmentById(itemId);
          
          if (!equipmentItem) {
            return;
          }
  
          showEditForm(equipmentItem);
        } catch (error) {
          console.error("❌ Error fetching equipment:", error);
        }
      } else {
        alert("You must be an admin or staff to edit equipment.");
      }
    }
  
    // ✅ DELETE BUTTON LOGIC
    if (e.target.id === "delete-button") {
      if (userRole === "admin" || userRole === "staff") {
        const confirmed = confirm("Are you sure you want to delete this equipment?");
        if (confirmed) {
          try {
            console.log("📌 Deleting equipment with ID:", itemId);
            const response = await fetch(`${API_URL}/equipment/${itemId}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token()}` },
            });
  
            if (!response.ok) throw new Error("Failed to delete equipment");
  
            console.log("✅ Equipment deleted successfully.");
            fetchAndDisplayEquipment();
          } catch (error) {
            console.error("❌ Error deleting equipment:", error);
            document.getElementById("equipment-message").textContent = "Error deleting equipment.";
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

export async function showEditForm(equipment) {
  console.log("Showing edit equipment form...");

  const editEquipmentDiv = document.getElementById("edit-equipment-div");
  const brandText = document.getElementById("edit-brand-text");
  const mountText = document.getElementById("edit-mount-text");
  const focalLengthText = document.getElementById("edit-focal-length-text");
  const apertureText = document.getElementById("edit-aperture-text");
  const versionText = document.getElementById("edit-version-text");
  const serialNumberText = document.getElementById("edit-serial-number-text");
  const updatedByInput = document.getElementById("edit-updated-by");
  const statusInput = document.getElementById("edit-status");
  const remarksInput = document.getElementById("edit-remarks");
  const equipmentDiv = document.getElementById("equipment-div");

  editEquipmentDiv.style.display = "block";
  equipmentDiv.style.display = "none";

  // Populate fields with equipment data
  brandText.textContent = equipment.brand;
  mountText.textContent = equipment.mount;
  focalLengthText.textContent = equipment.focalLength;
  apertureText.textContent = equipment.aperture;
  versionText.textContent = equipment.version;
  serialNumberText.textContent = equipment.serialNumber; 
  updatedByInput.value = equipment.updatedBy;
  statusInput.value = equipment.status;
  remarksInput.value = equipment.remarks;

      setDiv(editEquipmentDiv);
}

export const updateEquipment = async () => {
  enableInput(true);
  const equipmentId = document.getElementById("edit-equipment-id").value;
  const updatedBy = document.getElementById("edit-updated-by").value;
  const status = document.getElementById("edit-status").value;
  const remarks = document.getElementById("edit-remarks").value;

  console.log("Updating equipment...");

  try {
    const response = await fetch(`${API_URL}/equipment/${equipmentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ updatedBy, status, remarks }),
    });

    if (!response.ok) throw new Error("Failed to update equipment");

    console.log("✅ Equipment updated successfully.");
    updateEquipmentTable();
  } catch (error) {
    console.error("❌ Error updating equipment:", error);
    document.getElementById("equipment-message").textContent = "Error updating equipment.";
  }
}

