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
  equipmentDiv = document.getElementById("equipment");
  const logoff = document.getElementById("logoff");
  const addEquipment = document.getElementById("add-equipment");
  equipmentTable = document.getElementById("equipment-table");
  equipmentTableHeader = document.getElementById("equipment-table-header");
  enableInput(true);

  equipmentDiv.addEventListener("click", (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON")
    {
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

export const showEquipment = () => {
  setDiv(equipmentDiv);
  equipmentDiv.style.display = "block";
  showEquipment();
};



// const handleLogoff = () => {
//   setToken(null);
//   if (message) message.textContent = "You have been logged off.";
//   equipmentTable.replaceChildren([equipmentTableHeader]);
//   showLoginRegister();
// };


//   if (response.status === 401) {
//     const unauthMessage = document.getElementById("unauthMessage");
//     if (unauthMessage) {
//       unauthMessage.style.display = "block";
//       unauthMessage.textContent = "Unauthorized access. Please log in.";
//     } else {
//       console.warn("Warning: 'unauthMessage' element not found.");
//     }
//     return;
//   }
  
// const equipmentDiv = document.getElementById('equipment')

// const editEquipmentDiv = document.getElementById('edit-equipment')
//   async function showEditForm(item) {
//     const editForm = document.getElementById('edit-form');
//     editForm.querySelector('#brand').value = item.brand;
//     editForm.querySelector('#mount').value = item.mount;
//     editForm.querySelector('#focal-length').value = item.focalLength;
//     editForm.querySelector('#aperture').value = item.aperture;
//     editForm.querySelector('#version').value = item.version;
//     editForm.querySelector('#serial-number').value = item.serialNumber;
//     editForm.querySelector('#updated-by').value = item.updatedBy;
//     editForm.querySelector('#status').value = item.status;
//     editForm.querySelector('#remarks').value = item.remarks;

//     equipmentDiv.style.display = 'none';
//     editEquipmentDiv.style.display = 'block';
//   }

//   const data = await response.json();

//   if (response.ok && data.role && (data.role === "staff" || data.role === "admin")) {
//     enableInput(true);
//   } else {
//     enableInput(false);
//     unauthMessage.style.display = "block";
//     const inputFields = document.querySelectorAll("input, button");
//     inputFields.forEach(field => field.disabled = true);
    
//   }

//     let children = [equipmentTableHeader];

//     if (response.ok) {
//       if (data.count === 0) {
//         equipmentTable.replaceChildren(...children);
//       } else {
//         data.equipment.forEach((item) => {
//           let rowEntry = document.createElement("tr");
//           rowEntry.innerHTML = `
//             <td>${item.brand}</td>
//             <td>${item.mount}</td>
//             <td>${item.focalLength}</td>
//             <td>${item.aperture}</td>
//             <td>${item.version}</td>
//             <td>${item.status}</td>
//             <td>${item.serialNumber}</td>
//             <td>${item.createdBy}</td>
//             <td><button type="button" class="editButton" data-id=${item._id}>edit</button></td>
//             <td><button type="button" class="deleteButton" data-id=${item._id}>delete</button></td>
//           `;
//           children.push(rowEntry);
//         });
//         equipmentTable.replaceChildren(...children);
//       }
//     } else {
//       if (message) message.textContent = data.msg || "Error loading equipment.";
//     }
//     showEditForm();
// //   }  

//   export async function fetchAndDisplayEquipment() {
//     console.log("🔹 Fetching equipment data...");
//     const authToken = token(); // Store token in variable to avoid multiple calls
  
//     try {
//       const response = await fetch(`${API_URL}/equipment`, {
//         headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
//       });
  
//       if (!response.ok) throw new Error("Failed to fetch equipment");
  
//       const { equipment } = await response.json();
//       updateEquipmentTable(equipment);

//       fetchAndDisplayEquipment();
//     } catch (error) {
//       console.error("Error fetching equipment:", error);
//       document.getElementById("equipment-message").textContent = "Error loading equipment.";
//     }
//   }

//   function showAddEquipmentForm() {
//     const editForm = document.getElementById('edit-form');
//     editForm.reset(); // Clear any existing values in the form
  
//     const equipmentDiv = document.getElementById('equipment');
//     const editEquipmentDiv = document.getElementById('edit-equipment');
//     equipmentDiv.style.display = 'none';
//     editEquipmentDiv.style.display = 'block';

//  try {
//     const response = await fetch(`${API_URL}/equipment/${id}`, {
//       headers: {
//         Authorization: `Bearer ${token()}`,
//       },
//     });
//     if (!response.ok) throw new Error("Failed to fetch equipment");

//     const { equipment } = await response.json();
//     showEditForm(equipment);

    
//   showAddEquipmentForm();
//   }
//   catch (error) {
//     console.error("Error fetching equipment:", error);
//     document.getElementById("equipment-message").textContent = "Error loading equipment.";
//   }
// }  
//   export function updateEquipmentTable(equipment) {
//     const equipmentTable = document.getElementById('equipment-table');
//     const equipmentMessage = document.getElementById('equipment-message');
  
//     if (!equipmentTable || !equipmentMessage) {
//       return console.error("Equipment table or message element not found");
//     }
//     // Clear existing table rows except the header
//     equipmentTable.querySelectorAll('tr:not(:first-child)').forEach(row => row.remove());
  
//     if (!equipment.length) {
//       equipmentMessage.textContent = "No equipment available.";
//       return;
//     }
  
//     equipmentMessage.textContent = "";
//     equipment.forEach(item => {
//       const row = document.createElement('tr');
//       row.innerHTML = `
//         <td>${item.brand}</td>
//         <td>${item.mount}</td>
//         <td>${item.focalLength}</td>
//         <td>${item.aperture}</td>
//         <td>${item.version}</td>
//         <td>${item.status}</td>
//         <td>${item.updatedBy}</td>
//         <td><button class="editButton" data-id="${item._id}">Edit</button></td>
//         <td><button class="deleteButton" data-id="${item._id}">Delete</button></td>
//       `;
//       equipmentTable.appendChild(row);
//     });
//   }
  