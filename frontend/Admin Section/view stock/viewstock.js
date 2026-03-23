const loadStockBtn = document.getElementById('loadStockBtn');
const apiBaseUrlInput = document.getElementById('apiBaseUrl');
const apiTokenInput = document.getElementById('apiToken');
const statusMessage = document.getElementById('statusMessage');
const stockTableBody = document.getElementById('stockTableBody');

apiBaseUrlInput.value = FaceMobileApi.getApiBaseUrl();
apiTokenInput.value = FaceMobileApi.getToken();

const renderStockRows = (stockItems = []) => {
  if (!stockItems.length) {
    stockTableBody.innerHTML = '<tr><td colspan="7">No stock records found.</td></tr>';
    return;
  }

  stockTableBody.innerHTML = stockItems
    .map((item) => {
      const expiry = item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : '-';
      const updated = item.updated_at ? new Date(item.updated_at).toLocaleString() : '-';
      return `
        <tr>
          <td>${item.id ?? '-'}</td>
          <td>${item.medicine_name ?? '-'}</td>
          <td>${item.category ?? '-'}</td>
          <td>${item.quantity ?? '-'}</td>
          <td>${item.unit_price ?? '-'}</td>
          <td>${expiry}</td>
          <td>${updated}</td>
        </tr>
      `;
    })
    .join('');
};

const loadStock = async () => {
  const token = apiTokenInput.value.trim();

  if (!token) {
    statusMessage.textContent = 'JWT token is required to load stock.';
    return;
  }

  FaceMobileApi.setApiBaseUrl(apiBaseUrlInput.value);
  FaceMobileApi.setToken(token);
  statusMessage.textContent = 'Loading stock data...';

  try {
    const result = await FaceMobileApi.apiRequest('/stock', {
      method: 'GET',
    });

    renderStockRows(result.data);
    statusMessage.textContent = `Loaded ${result.data.length} stock item(s).`;
  } catch (error) {
    statusMessage.textContent = `Error: ${error.message}`;
    renderStockRows([]);
  }
};

loadStockBtn.addEventListener('click', loadStock);
