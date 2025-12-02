// app.js - FULL FIXED VERSION

document.addEventListener('DOMContentLoaded', () => {
  // ------------------ LOGIN ------------------
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const em = document.getElementById('loginEmail').value.trim();
      if (!em) return alert('Please enter your email.');
      if (!em.endsWith('@medipod.ph')) return alert('Email must be @medipod.ph');
      localStorage.setItem('medipod_current_user', em);
      location.href = 'code.html';
    });
  }

  // ------------------ CODE VERIFICATION ------------------
  const timerEl = document.getElementById('timer');
  if (timerEl) {
    let t = 50;
    timerEl.textContent = t;
    const iv = setInterval(() => {
      t -= 1;
      timerEl.textContent = t;
      if (t <= 0) {
        clearInterval(iv);
        timerEl.textContent = '0';
      }
    }, 1000);
  }

  const submitCode = document.getElementById('submitCode');
  if (submitCode) {
    submitCode.addEventListener('click', () => {
      const code = document.getElementById('verifyCode').value.trim();
      if (!code) return alert('Enter the code.');
      location.href = 'dashboard.html';
    });
  }

  // ------------------ RESET PASSWORD ------------------
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const pw = document.getElementById('newPassword').value;
      const pw2 = document.getElementById('retypePassword').value;
      if (!pw || !pw2) return alert('Fill both password fields.');
      if (pw !== pw2) return alert('Passwords do not match.');
      alert('Password updated. Please login.');
      location.href = 'login.html';
    });
  }

  // ------------------ SIDEBAR HIGHLIGHT ------------------
  const navLinks = document.querySelectorAll('.nav-link');
  if (navLinks.length) {
    const path = location.pathname.split('/').pop();
    navLinks.forEach(a => {
      if (a.getAttribute('href') === path) a.classList.add('active');
    });
  }

  // ------------------ PROFILE DROPDOWN ------------------
  const profileIcon = document.getElementById("profileIcon");
  const profileMenu = document.getElementById("profileMenu");
  if (profileIcon && profileMenu) {
    profileIcon.addEventListener("click", () => {
      profileMenu.style.display = profileMenu.style.display === "block" ? "none" : "block";
    });
  }

  // ------------------ PROFILE DATA ------------------
  const currentUser = localStorage.getItem("medipod_current_user");
  const emailField = document.getElementById("profileEmail");
  const nameField = document.getElementById("profileName");
  const ageField = document.getElementById("profileAge");
  const addressField = document.getElementById("profileAddress");
  const contactField = document.getElementById("profileContact");
  const saveBtn = document.getElementById("saveProfileBtn");
  const uploadProfile = document.getElementById("uploadProfile");
  const profilePicPreview = document.getElementById("profilePicPreview");
  const topProfileImg = document.getElementById("topProfileImg");

  if (emailField) {
    const savedData = JSON.parse(localStorage.getItem(`medipod_user_${currentUser}`)) || {};
    emailField.value = currentUser;
    nameField.value = savedData.name || "";
    ageField.value = savedData.age || "";
    addressField.value = savedData.address || "";
    contactField.value = savedData.contact || "";
    if (savedData.profilePic) {
      profilePicPreview.src = savedData.profilePic;
      topProfileImg.src = savedData.profilePic;
    }

    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        const updatedData = {
          name: nameField.value,
          age: ageField.value,
          address: addressField.value,
          contact: contactField.value,
          profilePic: savedData.profilePic || null
        };
        localStorage.setItem(`medipod_user_${currentUser}`, JSON.stringify(updatedData));
        alert("Profile updated successfully!");
      });
    }

    if (uploadProfile) {
      uploadProfile.addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
          profilePicPreview.src = e.target.result;
          topProfileImg.src = e.target.result;
          const userData = JSON.parse(localStorage.getItem(`medipod_user_${currentUser}`)) || {};
          userData.profilePic = e.target.result;
          localStorage.setItem(`medipod_user_${currentUser}`, JSON.stringify(userData));
        };
        reader.readAsDataURL(file);
      });
    }
  }

  // ------------------ LOGOUT ------------------
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("medipod_current_user");
      location.href = "login.html";
    });
  }

  // ------------------ REGISTRATION ------------------
  const createBtn = document.getElementById("createBtn");
  if (createBtn) {
    createBtn.addEventListener("click", () => {
      const email = document.getElementById("regEmail").value.trim();
      const pw = document.getElementById("regPassword").value;
      const pw2 = document.getElementById("regPassword2").value;
      if (!email.endsWith("@medipod.ph")) return alert("Email must end with @medipod.ph");
      if (pw !== pw2) return alert("Passwords do not match");
      const account = { email, password: pw, name: "", age: "", address: "", contact: "", profilePic: null };
      localStorage.setItem(`account_${email}`, JSON.stringify(account));
      alert("Account created successfully!");
      location.href = "login.html";
    });
  }
});

// =====================================================
// LOAD PATIENTS FROM LOCAL STORAGE
// =====================================================
let patients = JSON.parse(localStorage.getItem("patients")) || [
  {
    id: "00000",
    name: "John Cruz",
    age: 20,
    gender: "Male",
    contact: "+63 921 232 1234",
    lastVisit: "April 22, 2024",
    status: "Completed",
    birthday: "2004-01-01",
    email: "john.cruz@example.com",
    emergency: "+63 912 345 6789",
    address: "123 Main Street, Manila",
    conditions: "None",
    allergies: "Penicillin",
    notes: "Patient is healthy.",
    image: "",
    testHistory: [
      {
        date: "2024-04-22",
        type: "Blood Test",
        pod: "Pod 01",
        result: "Normal",
        technician: "Jane Doe",
        status: "Completed"
      }
    ]
  }
];

let currentEditingID = null;

// DOM ELEMENTS
const tbody = document.querySelector("#patientTable tbody");
const detailsModal = document.getElementById("detailsModal");
const addPatientModal = document.getElementById("addPatientModal");
const searchInput = document.getElementById("searchInput");
const genderFilter = document.getElementById("genderFilter");

// =====================================================
// LOAD PATIENTS INTO TABLE
// =====================================================
function loadPatients() {
  tbody.innerHTML = "";

  patients.forEach(patient => {
    if (!patient.id || !patient.name) return; // Prevent blank rows

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${patient.id}</td>
      <td>${patient.name}</td>
      <td>${patient.age}</td>
      <td>${patient.gender}</td>
      <td>${patient.contact}</td>
      <td>${patient.lastVisit}</td>
      <td>${patient.status}</td>
      <td>
        <button onclick="openDetails('${patient.id}')">View</button>
        <button onclick="deletePatient('${patient.id}')" style="background:red;color:white;">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// =====================================================
// ADD PATIENT
// =====================================================
function openAddPatientModal() { addPatientModal.style.display = "flex"; }
function closeAddPatientModal() { addPatientModal.style.display = "none"; }

document.getElementById("addPatientForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const id = document.getElementById("newPatientID").value.trim();
  const name = document.getElementById("newPatientName").value.trim();
  const age = document.getElementById("newPatientAge").value.trim();
  const gender = document.getElementById("newPatientGender").value.trim();
  const contact = document.getElementById("newPatientContact").value.trim();
  const lastVisit = document.getElementById("newPatientLastVisit").value;
  const status = document.getElementById("newPatientStatus").value;

  if (!id || !name) {
    alert("ID and Name are required!");
    return;
  }

  const newPatient = {
    id, name, age, gender, contact, lastVisit, status,
    birthday: "",
    email: "",
    emergency: "",
    address: "",
    conditions: "",
    allergies: "",
    notes: "",
    image: "",
    testHistory: []
  };

  patients.push(newPatient);
  localStorage.setItem("patients", JSON.stringify(patients));

  loadPatients();
  this.reset();
  closeAddPatientModal();
});

// =====================================================
// DELETE PATIENT
// =====================================================
function deletePatient(id) {
  if (!confirm("Delete this patient?")) return;
  patients = patients.filter(p => p.id !== id);
  localStorage.setItem("patients", JSON.stringify(patients));
  loadPatients();
}

// =====================================================
// VIEW DETAILS
// =====================================================
function openDetails(id) {
  currentEditingID = id;
  const p = patients.find(x => x.id === id);
  if (!p) return alert("Patient not found.");

  document.getElementById("modalName").textContent = p.name;
  document.getElementById("modalImage").src = p.image || "https://via.placeholder.com/100";

  document.getElementById("editBirthday").value = p.birthday || "";
  document.getElementById("editEmail").value = p.email || "";
  document.getElementById("editEmergency").value = p.emergency || "";
  document.getElementById("editAddress").value = p.address || "";
  document.getElementById("editConditions").value = p.conditions || "";
  document.getElementById("editAllergies").value = p.allergies || "";
  document.getElementById("editNotes").value = p.notes || "";

  loadTestHistory(p);

  detailsModal.style.display = "block";
}

function closeModal() {
  detailsModal.style.display = "none";
}

// =====================================================
// PROFILE PIC CHANGE
// =====================================================
document.getElementById("editProfilePic").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => document.getElementById("modalImage").src = e.target.result;
  reader.readAsDataURL(file);
});

// =====================================================
// SAVE EDITS
// =====================================================
function saveEdits() {
  const p = patients.find(x => x.id === currentEditingID);
  if (!p) return;

  p.birthday = document.getElementById("editBirthday").value;
  p.email = document.getElementById("editEmail").value;
  p.emergency = document.getElementById("editEmergency").value;
  p.address = document.getElementById("editAddress").value;
  p.conditions = document.getElementById("editConditions").value;
  p.allergies = document.getElementById("editAllergies").value;
  p.notes = document.getElementById("editNotes").value;

  // Save Test History
  const tbodyTests = document.querySelector("#testHistoryTable tbody");
  p.testHistory = [...tbodyTests.rows].map(row => ({
    date: row.cells[0].querySelector("input").value,
    type: row.cells[1].querySelector("input").value,
    pod: row.cells[2].querySelector("input").value,
    result: row.cells[3].querySelector("input").value,
    technician: row.cells[4].querySelector("input").value,
    status: row.cells[5].querySelector("select").value
  }));

  // Save Profile Image
  const upload = document.getElementById("editProfilePic").files[0];
  if (upload) {
    const reader = new FileReader();
    reader.onload = e => {
      p.image = e.target.result;
      localStorage.setItem("patients", JSON.stringify(patients));
      loadPatients();
      closeModal();
      alert("Changes saved!");
    };
    reader.readAsDataURL(upload);
  } else {
    localStorage.setItem("patients", JSON.stringify(patients));
    loadPatients();
    closeModal();
    alert("Changes saved!");
  }
}

// =====================================================
// TEST HISTORY
// =====================================================
function loadTestHistory(p) {
  const tbody = document.querySelector("#testHistoryTable tbody");
  tbody.innerHTML = "";

  p.testHistory.forEach(test => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="date" value="${test.date}"></td>
      <td><input type="text" value="${test.type}"></td>
      <td><input type="text" value="${test.pod}"></td>
      <td><input type="text" value="${test.result}"></td>
      <td><input type="text" value="${test.technician}"></td>
      <td>
        <select>
          <option value="Completed" ${test.status === "Completed" ? "selected" : ""}>Completed</option>
          <option value="Pending" ${test.status === "Pending" ? "selected" : ""}>Pending</option>
        </select>
      </td>
      <td><button onclick="removeTestRow(this)">Remove</button></td>
    `;
    tbody.appendChild(row);
  });
}

function addTestRow() {
  const tbody = document.querySelector("#testHistoryTable tbody");
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="date"></td>
    <td><input type="text"></td>
    <td><input type="text"></td>
    <td><input type="text"></td>
    <td><input type="text"></td>
    <td>
      <select>
        <option value="Completed">Completed</option>
        <option value="Pending">Pending</option>
      </select>
    </td>
    <td><button onclick="removeTestRow(this)">Remove</button></td>
  `;
  tbody.appendChild(row);
}

function removeTestRow(btn) {
  btn.closest("tr").remove();
}

// =====================================================
// SEARCH / FILTER
// =====================================================
function filterPatients() {
  const searchValue = searchInput.value.toLowerCase();
  const genderValue = genderFilter.value;

  [...tbody.rows].forEach(row => {
    const name = row.cells[1].textContent.toLowerCase();
    const gender = row.cells[3].textContent.toLowerCase();

    row.style.display =
      name.includes(searchValue) &&
      (genderValue === "all" || gender === genderValue)
        ? ""
        : "none";
  });
}

searchInput.addEventListener("keyup", filterPatients);
genderFilter.addEventListener("change", filterPatients);

// =====================================================
// INIT
// =====================================================
loadPatients();
