const patientForm = document.getElementById('patientForm');
const apiBaseUrlInput = document.getElementById('apiBaseUrl');
const apiTokenInput = document.getElementById('apiToken');
const statusMessage = document.getElementById('statusMessage');

apiBaseUrlInput.value = FaceMobileApi.getApiBaseUrl();
apiTokenInput.value = FaceMobileApi.getToken();

patientForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const token = apiTokenInput.value.trim();
  if (!token) {
    statusMessage.textContent = 'JWT token is required to create a patient.';
    return;
  }

  FaceMobileApi.setApiBaseUrl(apiBaseUrlInput.value);
  FaceMobileApi.setToken(token);

  const payload = {
    firstName: document.getElementById('firstName').value.trim(),
    lastName: document.getElementById('lastName').value.trim(),
    gender: document.querySelector('input[name="gender"]:checked')?.value,
    age: Number(document.getElementById('age').value),
    phone: document.getElementById('phone').value.trim(),
    address: document.getElementById('address').value.trim(),
    diagnosis: document.getElementById('diagnosis').value.trim(),
    doctorName: document.getElementById('doctorName').value.trim(),
  };

  statusMessage.textContent = 'Saving patient record...';

  try {
    const result = await FaceMobileApi.apiRequest('/patients', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    statusMessage.textContent = `${result.message} New patient ID: ${result.data.id}.`;
    patientForm.reset();
  } catch (error) {
    statusMessage.textContent = `Error: ${error.message}`;
  }
});
