const API_URL = "http://localhost:8080/api"

export async function getUsuarios(token) {
  const res = await fetch(`${API_URL}/usuarios`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) throw new Error("Sin permisos")
  return res.json()
}

export async function updateUsuario(id, data, token) {
  const res = await fetch(`${API_URL}/usuarios/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })

  if (!res.ok) throw new Error("Error al modificar usuario")
  return res.json()
}
