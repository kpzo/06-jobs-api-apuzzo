
import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showEquipment, fetchAndDisplayEquipment } from "./equipment.js";
import { showWelcome } from "./welcome.js";

let editEquipmentDiv = null;
let brand = null;
let status = null;
let mount = null;
let focalLength = null;
let aperture = null;
let version = null;
let serialNumber = null;
let updatedBy = null;
let addEquipmentDiv = null;

export const handleAddEdit = () => {
  editEquipmentDiv = document.getElementById("edit-equipment-div");
  addEquipmentDiv = document.getElementById("add-equipment-div");
  brand = document.getElementById("brand");
  mount = document.getElementById("mount");
  focalLength = document.getElementById("focal-length");
  aperture = document.getElementById("aperture");
  version = document.getElementById("version");
  serialNumber = document.getElementById("serial-number");
  updatedBy = document.getElementById("updated-by");
  status = document.getElementById("status");
  const editButton = document.getElementById("edit-button");
  const deleteButton = document.getElementById("delete-button");
  const goBackButton = document.getElementById("go-back-button");
  const editCancel = document.getElementById("edit-cancel");

document.addEventListener("DOMContentLoaded", () => {
  addEquipmentDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addEquipmentDiv) {
        enableInput(false);

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
    }
  });

  goBackButton.addEventListener("click", (e) => {
    e.preventDefault();
    setDiv(showWelcome);
  });

    editButton.addEventListener('click', () => {
      if (state.userRole === "admin" || state.userRole === "staff") {
        showEditForm(item);
          } else {
        alert("You must be an admin or staff to edit equipment.");
          }
    });

    deleteButton.addEventListener('click', async () => {
      if (state.userRole === "admin" || state.userRole === "staff") {
        const confirmed = confirm("Are you sure you want to delete this equipment?");
      if (confirmed) {
        try {
          const response = await fetch(`${API_URL}/equipment/${item._id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          });
                if (!response.ok) throw new Error("Failed to delete equipment");

                const { message } = await response.json();
                console.log("🗑️", message);
                fetchAndDisplayEquipment();
                } catch (error) {
                console.error("❌ Error deleting equipment:", error);
                document.getElementById('equipment-message').textContent = "Error deleting equipment.";
                }
            }
            } else {
            alert("You must be an admin or staff to delete equipment.");
            }
        })
});

}

export const showAddEquipmentForm = (equipment) => {
  message.textContent = "";
  setDiv(addEquipmentDiv);
};

export const showEditForm = (equipment) => {
  message.textContent = "";
  addEditDiv.addEventListener("click", async (e) => {
    if (!inputEnabled || e.target.nodeName !== "BUTTON") return;

    if (e.target === addingEquipment) {
      if (userRole !== 'admin' && userRole !== 'staff') {
        alert("You must be an admin or staff to add equipment.");
        return;
      }

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

