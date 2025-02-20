import {
    inputEnabled,
    setDiv,
    message,
    setToken,
    token,
    enableInput,
  } from "./index.js";
  import { showLoginRegister } from "./loginRegister.js";
  import { showAddEdit } from "./addEdit.js";
  
  let equipmentDiv = null;
  let equipmentTable = null;
  let equipmentTableHeader = null;
  
  export const handleEquipment = () => {
    equipmentDiv = document.getElementById("jobs");
    const logoff = document.getElementById("logoff");
    const addEquipment = document.getElementById("add-job");
    equipmentTable = document.getElementById("jobs-table");
    equipmentTableHeader = document.getElementById("jobs-table-header");
  
    equipmentDiv.addEventListener("click", (e) => {
      if (inputEnabled && e.target.nodeName === "BUTTON") {
        if (e.target === addEquipment) {
          showAddEdit(null);
        } else if (e.target === logoff) {
          showLoginRegister();
        }
      }
    });
  };
  
  export const showEquipment = async () => {
    setDiv(equipmentDiv);
  };