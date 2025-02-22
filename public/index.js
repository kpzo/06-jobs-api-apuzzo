const API_URL = "http://localhost:5000/api/v1";


import { showEquipment, handleEquipment } from "./equipment.js";
import { showLoginRegister, handleLoginRegister } from "./loginRegister.js";
import { handleLogin } from "./login.js";
import { handleAddEdit } from "./addEdit.js";
import { handleRegister, showRegister } from "./register.js";

let activeDiv = null;

export const setDiv = (newDiv) => {
  if (newDiv !== activeDiv) {
    if (activeDiv) activeDiv.style.display = "none";
    newDiv.style.display = "block";
    activeDiv = newDiv;
  }
};

export const state = {
  inputEnabled: true,
  token: sessionStorage.getItem("token") || null,
  message: null,
  userRole: null,
};

export const enableInput = (stateValue) => {
  state.inputEnabled = stateValue;
};

export const setToken = (value) => {
  state.token = value;
  if (value) {
    sessionStorage.setItem("token", value);
    const decodedToken = jwt_decode(value);
    state.userRole = decodedToken.role;
  } else {
    sessionStorage.removeItem("token");
    state.userRole = null;
  }
};


document.addEventListener("DOMContentLoaded", () => {
  state.message = document.getElementById("message");
  if (state.message) state.message.textContent = "";

  handleLoginRegister();
  handleLogin();
  handleEquipment();
  handleRegister();
  handleAddEdit();

  if (state.token) {
    showEquipment();
  } else {
    showLoginRegister();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Page loaded. Current path:", window.location.pathname);

  if (window.location.pathname === "/equipment") {
    fetchAndDisplayEquipment(); // ✅ Ensures equipment data loads on page load
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const logonButton = document.getElementById('logon-button');
  const registerButton = document.getElementById('register-button');
  const logonDiv = document.getElementById('logon-div');
  const registerDiv = document.getElementById('register-div');
  const logonCancelButton = document.getElementById('logon-cancel');
  const registerCancelButton = document.getElementById('register-cancel');
  const viewEquipmentFromLoginButton = document.getElementById('view-equipment-from-login');
  const viewEquipmentFromRegisterButton = document.getElementById('view-equipment-from-register');
  const equipmentDiv = document.getElementById('equipment');
  const editEquipmentDiv = document.getElementById('edit-equipment');  
  const viewAllEquipmentButton = document.getElementById('view-all-equipment');

  logonButton.addEventListener('click', () => {
      logonDiv.style.display = 'block';
      registerDiv.style.display = 'none';
      equipmentDiv.style.display = 'none';
      editEquipmentDiv.style.display = 'none';
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
  });

  viewEquipmentFromLoginButton.addEventListener("click", (e) => {
    e.preventDefault(); // Prevents page refresh
    history.pushState({}, "", "/equipment"); // Updates the browser URL
    fetchAndDisplayEquipment(); // Calls the function to render equipment dynamically
});

viewEquipmentFromRegisterButton.addEventListener("click", (e) => {
    e.preventDefault();
    history.pushState({}, "", "/equipment");
    fetchAndDisplayEquipment();
});
viewAllEquipmentButton.addEventListener('click', (e) => {
  e.preventDefault();
  history.pushState({}, "", "/equipment");
  fetchAndDisplayEquipment();
});
const addEquipmentButton = document.getElementById('add-equipment');
addEquipmentButton.addEventListener('click', (e) => {
  e.preventDefault();
  history.pushState({}, "", "/equipment/edit");
  showAddEquipmentForm();
});

function showAddEquipmentForm() {
  const editForm = document.getElementById('edit-form');
  editForm.reset(); // Clear any existing values in the form

  const equipmentDiv = document.getElementById('equipment');
  const editEquipmentDiv = document.getElementById('edit-equipment');
  equipmentDiv.style.display = 'none';
  editEquipmentDiv.style.display = 'block';
}
});

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


async function fetchAndDisplayEquipment() {
  console.log("🔹 Fetching equipment data...");
  const authToken = token(); // Store token in variable to avoid multiple calls

  try {
    const response = await fetch(`${API_URL}/equipment`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    });

    if (!response.ok) throw new Error("Failed to fetch equipment");

    const { equipment } = await response.json();
    updateEquipmentTable(equipment);
  } catch (error) {
    console.error("Error fetching equipment:", error);
    document.getElementById("equipment-message").textContent = "Error loading equipment.";
  }
}



//         // Add event listener for the Edit button
//         row.querySelector('.editButton').addEventListener('click', () => {
//             if (state.userRole === "admin" || state.userRole === "staff") {
//             showEditForm(item);
//             } else {
//             alert("You must be an admin or staff to edit equipment.");
//             }
//         });
      
//         // Add event listener for the Delete button
//         row.querySelector('.deleteButton').addEventListener('click', async () => {
//             if (state.userRole === "admin" || state.userRole === "staff") {
//             const confirmed = confirm("Are you sure you want to delete this equipment?");
//             if (confirmed) {
//                 try {
//                 const response = await fetch(`${API_URL}/equipment/${item._id}`, {
//                     method: "DELETE",
//                     headers: {
//                     Authorization: `Bearer ${state.token}`,
//                     },
//                 });

//                 if (!response.ok) throw new Error("Failed to delete equipment");

//                 const { message } = await response.json();
//                 console.log("🗑️", message);
//                 fetchAndDisplayEquipment();
//                 } catch (error) {
//                 console.error("❌ Error deleting equipment:", error);
//                 document.getElementById('equipment-message').textContent = "Error deleting equipment.";
//                 }
//             }
//             } else {
//             alert("You must be an admin or staff to delete equipment.");
//             }
//         });
//         catch (error) {
//     console.error("Error fetching equipment:", error);
//     const equipmentMessage = document.getElementById('equipment-message');
//     equipmentMessage.textContent = "Error loading equipment.";
//   }
// }
  export async function showEditForm(item) {
    const editForm = document.getElementById('edit-form');
    editForm.querySelector('#brand').value = item.brand;
    editForm.querySelector('#mount').value = item.mount;
    editForm.querySelector('#focal-length').value = item.focalLength;
    editForm.querySelector('#aperture').value = item.aperture;
    editForm.querySelector('#version').value = item.version;
    editForm.querySelector('#serial-number').value = item.serialNumber;
    editForm.querySelector('#updated-by').value = item.updatedBy;
    editForm.querySelector('#status').value = item.status;
    editForm.querySelector('#remarks').value = item.remarks;

    const equipmentDiv = document.getElementById('equipment');
    const editEquipmentDiv = document.getElementById('edit-equipment');
    equipmentDiv.style.display = 'none';
    editEquipmentDiv.style.display = 'block';
  }

export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "UTC" };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
};

export const inputEnabled = () => {
  return state.inputEnabled;
};

export const message = (msg) => {
  if (state.message) {
    state.message.textContent = msg;
  }
};

export const token = () => {
  return state.token;
};