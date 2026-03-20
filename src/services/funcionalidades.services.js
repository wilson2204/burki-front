export async function getFuncionalidades() {
  // MOCK TEMPORAL (simulando lo que devolvería el back)
  return Promise.resolve({
    "Usuarios": true,
    "Artículos": true,
    "Promociones": false,
    "Clientes": true,
    "Proveedores": true,
    "Asentar compras": false,
    "Cambios de precios": true,
    "Stock movimientos": false,
    "Consultar informes": true
  });
}
