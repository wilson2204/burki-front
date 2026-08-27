const API = "http://localhost:8080/back_office";

let refreshPromise = null;

async function refreshToken() {
  const response = await fetch(`${API}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Refresh expirado");
  }
}

export async function apiFetch(endpoint, options = {}) {
  const request = () =>
    fetch(`${API}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

  let response = await request();

  if (response.status !== 401) {
    return response;
  }

  try {
    // Si nadie está refrescando, empezamos nosotros
    if (!refreshPromise) {
      refreshPromise = refreshToken().finally(() => {
        refreshPromise = null;
      });
    }

    // Todos esperan el mismo refresh
    await refreshPromise;

    // Reintentamos la petición original
    response = await request();

    return response;
  } catch (error) {
    localStorage.clear();
    sessionStorage.clear();

    window.location.href = "/";

    throw error;
  }
}