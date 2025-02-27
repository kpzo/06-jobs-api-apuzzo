
import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showEquipment, fetchAndDisplayEquipment, addEquipment } from "./equipment.js";
import { showWelcome } from "./welcome.js";

let brand = null;
let status = null;
let mount = null;
let focalLength = null;
let aperture = null;
let version = null;
let serialNumber = null;
let updatedBy = null;


document.addEventListener("DOMContentLoaded", () => {
const welcomeAddEquipmentButton = document.getElementById("add-equipment-after-login-button");
const addEquipmentDiv = document.getElementById("add-equipment-div");
const welcomeDiv = document.getElementById("welcome-div");
const goBackButton = document.getElementById("go-back-button");
const user = JSON.parse(localStorage.getItem("user"));
const editCancel = document.getElementById("edit-cancel-button");

  window.addEventListener("beforeunload", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));  // ✅ Resave user info
    }
  });

  welcomeAddEquipmentButton.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addEquipmentDiv) {
        enableInput(true);

        let method = "POST";
        let url = "/api/v1/equipment";
        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token()}`,
            },
            body: JSON.stringify({
              brand: brand.value,
              mount: mount.value,
              focalLength: focalLength.value,
              aperture: aperture.value,
              version: version.value,
              serialNumber: serialNumber.value,
              updatedBy: updatedBy.value,
              status: status.value,
            }),
          });

          const data = await response.json();
          if (response.status === 201) {
            message.textContent = "The equipment entry was created.";
            brand.value = "";
            mount.value = "";
            focalLength.value = "";
            aperture.value = "";
            version.value = "";
            serialNumber.value = "";
            updatedBy.value = "";
            status.value = "available";

            showEquipment();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.error(err);
          message.textContent = "A communication error occurred.";
        }
        enableInput(true);
      } else if (e.target === editCancel) {
        message.textContent = "";
        showEquipment();
      }
      addEquipment()
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
})

  document.addEventListener("click", async (e) => {
    if (e.target && e.target.id === "edit-button") {
      if (state.userRole === "admin" || state.userRole === "staff") {
        showEditForm();
      } else {
        alert("You must be an admin or staff to edit equipment.");
      }
    }
  
    if (e.target && e.target.id === "delete-button") {
      if (state.userRole === "admin" || state.userRole === "staff") {
        const confirmed = confirm("Are you sure you want to delete this equipment?");
        if (confirmed) {
          try {
            const response = await fetch(`${API_URL}/equipment/${item._id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token()}` },
            });
  
            if (!response.ok) throw new Error("Failed to delete equipment");
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


export const showEditForm = (equipment) => {
  const editEquipmentDiv = document.getElementById("edit-equipment-div");
  document.getElementById("edit-brand").value = equipment.brand;
  document.getElementById("edit-mount").value = equipment.mount;
  document.getElementById("edit-focal-length").value = equipment.focalLength;
  document.getElementById("edit-aperture").value = equipment.aperture;
  document.getElementById("edit-version").value = equipment.version;
  document.getElementById("edit-serial-number").value = equipment.serialNumber;
  document.getElementById("edit-updated-by").value = equipment.updatedBy;
  document.getElementById("edit-status").value = equipment.status;
  const editForm = document.getElementById("edit-form");
  message.textContent = "";
  addEditDiv.addEventListener("click", async (e) => {
    if (!inputEnabled || e.target.nodeName !== "BUTTON") return;

    if (e.target === addingEquipment) {
      if (userRole !== 'admin' && userRole !== 'staff') {
        alert("You must be an admin or staff to add equipment.");
        return;
      }

      setDiv(editEquipmentDiv);
      enableInput(true);

      enableInput(false);

      let method = "POST";
      let url = "/api/v1/equipment";

      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            brand: brand.value,
            mount: mount.value,
            focalLength: focalLength.value,
            aperture: aperture.value,
            version: version.value,
            serialNumber: serialNumber.value,
            updatedBy: updatedBy.value,
            status: status.value,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          if (message) message.textContent = "The equipment entry was created.";

          // Reset fields
          brand.value = "";
          mount.value = "";
          focalLength.value = "";
          aperture.value = "";
          version.value = "";
          serialNumber.value = "";
          updatedBy.value = "";
          status.value = "available";

          showEquipment();
        } else {
          if (message) message.textContent = data.msg;
        }
      } catch (err) {
        console.error(err);
        if (message) message.textContent = "A communication error occurred.";
      }

      enableInput(true);
    } else if (e.target === editCancel) {
      if (message) message.textContent = "";
      showEquipment();
    }
  });
};

