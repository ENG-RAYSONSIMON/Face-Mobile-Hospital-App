(function initApiClient(globalScope) {
  const STORAGE_KEYS = {
    token: 'faceMobile.token',
    apiBaseUrl: 'faceMobile.apiBaseUrl',
    user: 'faceMobile.user',
  };

  const normalizeBaseUrl = (baseUrl) => {
    const value = (baseUrl || '').trim();
    return value.replace(/\/$/, '');
  };

  const getApiBaseUrl = () => normalizeBaseUrl(localStorage.getItem(STORAGE_KEYS.apiBaseUrl) || 'http://localhost:5000/api');

  const setApiBaseUrl = (baseUrl) => {
    localStorage.setItem(STORAGE_KEYS.apiBaseUrl, normalizeBaseUrl(baseUrl));
  };

  const getToken = () => localStorage.getItem(STORAGE_KEYS.token) || '';
  const setToken = (token) => localStorage.setItem(STORAGE_KEYS.token, token || '');

  const setUser = (user) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    }
  };

  const getUser = () => {
    const rawUser = localStorage.getItem(STORAGE_KEYS.user);
    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser);
    } catch (error) {
      return null;
    }
  };

  const apiRequest = async (path, options = {}) => {
    const baseUrl = getApiBaseUrl();
    const token = getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.success === false) {
      throw new Error(result.message || `Request failed (${response.status}).`);
    }

    return result;
  };

  globalScope.FaceMobileApi = {
    STORAGE_KEYS,
    getApiBaseUrl,
    setApiBaseUrl,
    getToken,
    setToken,
    getUser,
    setUser,
    apiRequest,
  };
})(window);
