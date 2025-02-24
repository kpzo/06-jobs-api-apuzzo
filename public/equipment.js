import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";

import { showAddEdit } from "./addEdit.js";
import { showLogin } from "./login.js";
import { showLoginRegister } from "./loginRegister.js";

let equipmentDiv = null;
let equipmentTable = null;
let equipmentTableHeader = null;
let response = null;
let data = null;

export const handleEquipment = async () => {
  response = await fetch('/equipment', {
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  }); // Fetch equipment data from the server
  const data = await response.json();
  equipmentDiv = document.getElementById("equipment");
  const logoff = document.getElementById("logoff");
  const addEquipmentDiv = document.getElementById("add-equipment-div");
  const editEquipmentDiv = document.getElementById("edit-equipment-div");
  const viewAllEquipmentButton = document.getElementById("view-all-equipment");
  equipmentTable = document.getElementById("equipment-table");
  equipmentTableHeader = document.getElementById("equipment-table-header");

  enableInput(true);

viewAllEquipmentButton.addEventListener("click", (e) => {
  e.preventDefault();
  fetchAndDisplayEquipment();
  if (inputEnabled && e.target.nodeName === "BUTTON") {
    if (e.target === addEquipment) {
      showAddEdit(null);
    } else if (e.target === logoff) {
      showLoginRegister();
    }
  } else if (e.target === logoff) {
    setToken(null);

    message.textContent = "You have been logged off.";

    equipmentTable.replaceChildren([equipmentTableHeader]);

    showLoginRegister();
  }
});
};

document.addEventListener('DOMContentLoaded', () => {
  const logonButton = document.getElementById('logon-button');
  const registerButton = document.getElementById('register-button');
  const logonDiv = document.getElementById('logon-div');
  const registerDiv = document.getElementById('register-div');
  const logonCancelButton = document.getElementById('logon-cancel');
  const registerCancelButton = document.getElementById('register-cancel');
  const equipmentDiv = document.getElementById('equipment-div');
  const editEquipmentDiv = document.getElementById('edit-equipment-div');  
  const viewAllEquipmentButton = document.getElementById('view-all-equipment');
  const message = document.getElementById('message');
  const unauthMessage = document.getElementById('unauth-message');
  const submitUpdate = document.getElementById('submit-update');
  const submitAdd = document.getElementById('submit-add');
  const submitDelete = document.getElementById('submit-delete');
  const addNewEquipment = document.getElementById('add-equipment-div');
  const equipmentTable = document.getElementById('equipment-table');
  const editEquipmentButton = document.getElementById('edit-equipment-button');

  logonButton.addEventListener('click', () => {
      logonDiv.style.display = 'block';
      registerDiv.style.display = 'none';
      equipmentDiv.style.display = 'none';
      editEquipmentDiv.style.display = 'none';
      showLogin(); // Calls the function to render equipment dynamically
  });

  registerButton.addEventListener('click', () => {
      registerDiv.style.display = 'block';
      logonDiv.style.display = 'none';
      equipmentDiv.style.display = 'none';
      editEquipmentDiv.style.display = 'none';
  });

  logonCancelButton.addEventListener('click', () => {
      logonDiv.style.display = 'none';
  });

  registerCancelButton.addEventListener('click', () => {
      registerDiv.style.display = 'none';
      showLoginRegister();
  });

  viewAllEquipmentButton.addEventListener('click', () => {
      equipmentDiv.style.display = 'block';
      logonDiv.style.display = 'none';
      registerDiv.style.display = 'none';
      editEquipmentDiv.style.display = 'none';
      fetchAndDisplayEquipment();
  });

  addNewEquipment.addEventListener('click', (e) => {
      e.preventDefault();
      showAddEquipmentForm();
  }); 

  submitAdd.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = document.getElementById('edit-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const response = await fetch(`${API_URL}/equipment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token()}`,
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const { equipment } = await response.json();
      updateEquipmentTable(equipment);
      form.reset();
      showEquipment();
    } else {
      const { message } = await response.json();
      document.getElementById('equipment-message').textContent = message;
    }
  });

  editEquipmentButton.addEventListener('click', async (e) => {
  async function showEditForm(item) {
    const editForm = document.getElementById('edit-form');
    editForm.querySelector('#edit-brand').value = item.brand;
    editForm.querySelector('#edit-mount').value = item.mount;
    editForm.querySelector('#edit-focal-length').value = item.focalLength;
    editForm.querySelector('#edit-aperture').value = item.aperture;
    editForm.querySelector('#edit-version').value = item.version;
    editForm.querySelector('#edit-serial-number').value = item.serialNumber;
    editForm.querySelector('#edit-updated-by').value = item.updatedBy;
    editForm.querySelector('#edit-status').value = item.status;
    editForm.querySelector('#edit-remarks').value = item.remarks;

    equipmentDiv.style.display = 'none';
    editEquipmentDiv.style.display = 'block';
  }

  if (response.ok && data.role && (data.role === "staff" || data.role === "admin")) {
    enableInput(true);
  } else {
    enableInput(false);
    unauthMessage.style.display = "block";
    const inputFields = document.querySelectorAll("input, button");
    inputFields.forEach(field => field.disabled = true);
    
  }

    let children = [equipmentTableHeader];

    if (response.ok) {
      if (data.count === 0) {
        equipmentTable.replaceChildren(...children);
      } else {
        data.equipment.forEach((item) => {
          let rowEntry = document.createElement("tr");
          rowEntry.innerHTML = `
            <td>${item.brand}</td>
            <td>${item.mount}</td>
            <td>${item.focalLength}</td>
            <td>${item.aperture}</td>
            <td>${item.version}</td>
            <td>${item.status}</td>
            <td>${item.serialNumber}</td>
            <td>${item.createdBy}</td>
            <td><button type="button" class="editButton" data-id=${item._id}>edit</button></td>
            <td><button type="button" class="deleteButton" data-id=${item._id}>delete</button></td>
          `;
          children.push(rowEntry);
        });
        equipmentTable.replaceChildren(...children);
      }
    } else {
      if (message) message.textContent = data.msg || "Error loading equipment.";
    }
    showEditForm();
  });
})
  
  export async function fetchAndDisplayEquipment() {
    console.log("🔹 Fetching equipment data...");
    const authToken = token(); // Store token in variable to avoid multiple calls
  
    try {
      const response = await fetch(`${API_URL}/equipment`, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });
  
      if (!response.ok) throw new Error("Failed to fetch equipment");
  
      const { equipment } = await response.json();
      updateEquipmentTable(equipment);

      fetchAndDisplayEquipment();
    } catch (error) {
      console.error("Error fetching equipment:", error);
      document.getElementById("equipment-message").textContent = "Error loading equipment.";
    }
  }

  export async function showAddEquipmentForm() {
    const editForm = document.getElementById('edit-form');
    editForm.reset(); // Clear any existing values in the form
  
    const equipmentDiv = document.getElementById('equipment-div');
    const editEquipmentDiv = document.getElementById('edit-equipment-div');
    equipmentDiv.style.display = 'none';
    editEquipmentDiv.style.display = 'block';

 try {
    const response = await fetch(`${API_URL}/equipment/${id}`, {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch equipment");

    const { equipment } = await response.json();
    showEditForm(equipment);

    
  showAddEquipmentForm();
  }
  catch (error) {
    console.error("Error fetching equipment:", error);
    document.getElementById("equipment-message").textContent = "Error loading equipment.";
  }
}  
  export function updateEquipmentTable(equipment) {
    const equipmentTable = document.getElementById('equipment-table');
    const equipmentMessage = document.getElementById('equipment-message');
  
    if (!equipmentTable || !equipmentMessage) {
      return console.error("Equipment table or message element not found");
    }
    // Clear existing table rows except the header
    equipmentTable.querySelectorAll('tr:not(:first-child)').forEach(row => row.remove());
  
    if (!equipment.length) {
      equipmentMessage.textContent = "No equipment available.";
      return;
    }
  
    equipmentMessage.textContent = "";
    equipment.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.brand}</td>
        <td>${item.mount}</td>
        <td>${item.focalLength}</td>
        <td>${item.aperture}</td>
        <td>${item.version}</td>
        <td>${item.status}</td>
        <td>${item.updatedBy}</td>
        <td><button class="editButton" data-id="${item._id}">Edit</button></td>
        <td><button class="deleteButton" data-id="${item._id}">Delete</button></td>
      `;
      equipmentTable.appendChild(row);
    });
  }
  export const showEquipment = () => {
    const equipmentDiv = document.getElementById("equipment-div");
    const editEquipmentButton = document.getElementById("edit-equipment-button");
    const addNewEquipment = document.getElementById("add-equipment-div");
    const token = localStorage.getItem("token");
    setDiv(equipmentDiv);
    
    enableInput(false);
  
    message.textContent = ""; 
    editEquipmentButton.style.display = "block";
    addNewEquipment.style.display = "block";
    equipmentDiv.style.display = token ? "block" : "none";
  
    editEquipmentButton.addEventListener("click", (e) => {
      e.preventDefault();
      showAddEquipmentForm();
    });
  };
