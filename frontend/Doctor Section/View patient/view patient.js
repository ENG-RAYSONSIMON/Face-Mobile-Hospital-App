const loadPatientsBtn = document.getElementById('loadPatientsBtn');
const patientsTableBody = document.getElementById('patientsTableBody');
const apiBaseUrlInput = document.getElementById('apiBaseUrl');
const apiTokenInput = document.getElementById('apiToken');
const statusMessage = document.getElementById('statusMessage');

apiBaseUrlInput.value = FaceMobileApi.getApiBaseUrl();
apiTokenInput.value = FaceMobileApi.getToken();

const renderRows = (patients = []) => {
  if (!patients.length) {
    patientsTableBody.innerHTML = '<tr><td colspan="10">No patients found.</td></tr>';
    return;
  }

  patientsTableBody.innerHTML = patients
    .map((patient) => {
      const createdDate = patient.created_at
        ? new Date(patient.created_at).toLocaleDateString()
        : '-';

      return `
        <tr>
          <th scope="row">${patient.id ?? '-'}</th>
          <td>${patient.first_name ?? '-'}</td>
          <td>${patient.last_name ?? '-'}</td>
          <td>${patient.age ?? '-'}</td>
          <td>${patient.diagnosis ?? '-'}</td>
          <td>${patient.gender ?? '-'}</td>
          <td>${patient.phone ?? '-'}</td>
          <td>${patient.address ?? '-'}</td>
          <td>${patient.doctor_name ?? '-'}</td>
          <td>${createdDate}</td>
        </tr>
      `;
    })
    .join('');
};

const loadPatients = async () => {
  const apiBaseUrl = apiBaseUrlInput.value.trim();
  const token = apiTokenInput.value.trim();

  if (!token) {
    statusMessage.textContent = 'Please provide a JWT token before loading patients.';
    return;
  }

  FaceMobileApi.setApiBaseUrl(apiBaseUrl);
  FaceMobileApi.setToken(token);
  statusMessage.textContent = 'Loading patients from backend API...';

  try {
    const result = await FaceMobileApi.apiRequest('/patients', {
      method: 'GET',
    });

    renderRows(result.data);
    statusMessage.textContent = `Loaded ${result.data.length} patient(s) from ${FaceMobileApi.getApiBaseUrl()}/patients.`;
  } catch (error) {
    statusMessage.textContent = `Error: ${error.message}`;
    renderRows([]);
  }
};

loadPatientsBtn.addEventListener('click', loadPatients);
