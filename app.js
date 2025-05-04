const form = document.getElementById('job-form');
const jobList = document.getElementById('job-list');
const addJobBtn = document.getElementById('add-job-btn');
const closePopupBtn = document.getElementById('close-popup-btn');
const popupForm = document.getElementById('popup-form');
const exportCsvBtn = document.getElementById('export-csv-btn');
const importCsvBtn = document.getElementById('import-csv-btn');
let jobs = JSON.parse(localStorage.getItem('jobs')) || [];
let editingJobIndex = null;

// Function to render jobs
function renderJobs() {
  jobList.innerHTML = '';
  jobs.forEach((job, index) => {
    const div = document.createElement('div');
    div.className = 'job';
    div.innerHTML = `
      <div class="header">${job.role} @ ${job.company}</div>
      <div>Status: ${job.status}</div>
      <div>Notes: ${job.notes || '—'}</div>
      <button class="delete-btn" onclick="deleteJob(${index})">Delete</button>
      <button class="delete-btn" onclick="editJob(${index})">Edit</button>
    `;
    jobList.appendChild(div);
  });
}

// Add or Edit Job
function openPopupForJob(jobIndex = null) {
  if (jobIndex !== null) {
    editingJobIndex = jobIndex;
    const job = jobs[editingJobIndex];
    document.getElementById('company').value = job.company;
    document.getElementById('role').value = job.role;
    document.getElementById('status').value = job.status;
    document.getElementById('notes').value = job.notes;
  } else {
    editingJobIndex = null;
    form.reset();
  }
  popupForm.style.visibility = 'visible';
}

// Save Job (Add/Edit)
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const job = {
    company: document.getElementById('company').value,
    role: document.getElementById('role').value,
    status: document.getElementById('status').value,
    notes: document.getElementById('notes').value,
  };

  if (editingJobIndex === null) {
    jobs.push(job);
  } else {
    jobs[editingJobIndex] = job;
  }

  localStorage.setItem('jobs', JSON.stringify(jobs));
  popupForm.style.visibility = 'hidden';
  renderJobs();
});

// Close Popup
closePopupBtn.addEventListener('click', () => {
  popupForm.style.visibility = 'hidden';
});

// Delete Job
function deleteJob(index) {
  jobs.splice(index, 1);
  localStorage.setItem('jobs', JSON.stringify(jobs));
  renderJobs();
}

// Edit Job
function editJob(index) {
  openPopupForJob(index);
}

// Export to CSV
exportCsvBtn.addEventListener('click', () => {
  const csv = jobs.map(job => `${job.company},${job.role},${job.status},${job.notes}`).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'jobs.csv';
  a.click();
});

// Import CSV
importCsvBtn.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function (event) {
    const csv = event.target.result;
    const rows = csv.split('\n').map(row => row.split(','));
    jobs = rows.map(row => ({
      company: row[0],
      role: row[1],
      status: row[2],
      notes: row[3],
    }));
    localStorage.setItem('jobs', JSON.stringify(jobs));
    renderJobs();
  };
  reader.readAsText(file);
});

// Open Add Job Popup
addJobBtn.addEventListener('click', () => openPopupForJob());

// Initial render
renderJobs();
