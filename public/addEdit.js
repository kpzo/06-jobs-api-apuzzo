import { enableInput, inputEnabled, message, setDiv, token, state } from "./index.js";
import { showEquipment } from "./equipment.js";

let addEditDiv = null;
let brand = null;
let status = null;
let mount = null;
let focalLength = null;
let aperture = null;
let version = null;
let serialNumber = null;
let updatedBy = null;
let addingEquipment = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-equipment");
  if (!addEditDiv) return;

  brand = document.getElementById("brand");
  mount = document.getElementById("mount");
  focalLength = document.getElementById("focal-length");
  aperture = document.getElementById("aperture");
  version = document.getElementById("version");
  serialNumber = document.getElementById("serial-number");
  updatedBy = document.getElementById("updated-by");
  status = document.getElementById("status");
  addingEquipment = document.getElementById("adding-equipment");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", (e) => {
    if (!inputEnabled) return;

    if (e.target === addingEquipment || e.target === editCancel) {
      showEquipment();
    }
  });

  addEditDiv.addEventListener("click", async (e) => {
    if (!inputEnabled || e.target.nodeName !== "BUTTON") return;

    if (e.target === addingEquipment) {
      if (state.userRole !== 'admin' && state.userRole !== 'staff') {
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

export const showAddEdit = (equipment) => {
  if (message) message.textContent = "";
  setDiv(addEditDiv);
};