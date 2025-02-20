import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showJobs } from "./jobs.js";

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
  addEditDiv = document.getElementById("edit-job");
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
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingEquipment) {
        showJobs();
      } else if (e.target === editCancel) {
        showJobs();
      }
    }
  });
};

export const showAddEdit = (job) => {
  message.textContent = "";
  setDiv(addEditDiv);
};