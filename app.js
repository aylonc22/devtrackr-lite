const form = document.getElementById('job-form');
const jobList = document.getElementById('job-list');
let jobs = JSON.parse(localStorage.getItem('jobs')) || [];

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
    `;
    jobList.appendChild(div);
  });
}

function deleteJob(index) {
  jobs.splice(index, 1);
  localStorage.setItem('jobs', JSON.stringify(jobs));
  renderJobs();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const job = {
    company: document.getElementById('company').value,
    role: document.getElementById('role').value,
    status: document.getElementById('status').value,
    notes: document.getElementById('notes').value
  };
  jobs.push(job);
  localStorage.setItem('jobs', JSON.stringify(jobs));
  form.reset();
  renderJobs();
});

renderJobs();
