const loginForm = document.getElementById('loginForm');
const apiBaseUrlInput = document.getElementById('apiBaseUrl');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const userTypeInput = document.getElementById('userType');
const statusMessage = document.getElementById('statusMessage');

apiBaseUrlInput.value = FaceMobileApi.getApiBaseUrl();

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  const userType = userTypeInput.value.trim().toLowerCase();

  if (!username || !password) {
    statusMessage.textContent = 'Username and password are required.';
    return;
  }

  FaceMobileApi.setApiBaseUrl(apiBaseUrlInput.value);
  statusMessage.textContent = 'Signing in...';

  try {
    const result = await FaceMobileApi.apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    const { token, user } = result.data;

    if (userType && user.role !== userType) {
      throw new Error(`Logged in as ${user.role}, but selected ${userType}.`);
    }

    FaceMobileApi.setToken(token);
    FaceMobileApi.setUser(user);

    statusMessage.textContent = `Welcome ${user.fullName || user.username}. Redirecting...`;

    const nextPage = user.role === 'admin'
      ? '../Admin Section/view stock/viewstock.html'
      : '../Doctor Section/View patient/view patient.html';

    window.location.href = nextPage;
  } catch (error) {
    statusMessage.textContent = `Login failed: ${error.message}`;
  }
});
