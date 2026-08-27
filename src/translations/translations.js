export const texts = {
  es: {
    common: {
      save: "Guardar",
      cancel: "Cancelar",
      delete: "Eliminar",
      edit: "Editar",
      search: "Buscar",
      add: "Agregar",
      close: "Cerrar",
      loading: "Cargando...",
      new: "Nuevo",
      duplicate: "Duplicar",
      exit: "Salir",
      code: "Código",
      name: "Nombre",
      id: "ID",
      select: "Seleccione",
      list: "Lista",
      all:"Todos",
    },

    dashboard: {
      hello: "Hola",
      welcome: "Bienvenido al panel de administración",
      articles: "Artículos",
      clients: "Clientes",
      branches: "Sucursales",
      stock: "Stock",
      prices: "Precios",
      logout: "Salir"
    },

    login: {
      title: "Backoffice Bruki",
      subtitle: "Ingresá con tu usuario",
      pin: "PIN",
      password: "Contraseña",
      login: "Iniciar sesión",
      quickAccess: "Acceso rápido"
    },

    articulos: {
      title: "Artículos",
      newArticle: "Nuevo Artículo",
      barcode: "Código de Barras",
      name: "Nombre",
      price: "Precio",
      stock: "Stock"
    },

    usuarios: {
      title: "Usuarios",
      newUser: "Nuevo Usuario",
      role: "Rol"
    },

    sucursales: {
      title: "Sucursales",
      newBranch: "Nueva Sucursal"
    },
    clasificaciones: {
  title: "Clasificaciones"
},
suppliers: {
  title: "Proveedores",
  selectSupplier: "Seleccioná un proveedor",
  selectOne: "Seleccioná uno",
  confirmDelete: "¿Eliminar proveedor?",
  companyName: "Razón social",
  company: "Empresa",
  cuit: "CUIT",
  address: "Dirección",
  phone: "Teléfono",
  email: "Email",
  description: "Descripción",
  currency: "Moneda",
  selectCurrency: "Seleccionar moneda"
},
subdepartamentos: {
  title: "Sub-Departamentos",
  single: "SubDepartamento",
  completeData: "Complete los datos",
  selectRecord: "Seleccione un registro",
  confirmDelete: "¿Eliminar?",
  saveError: "Error guardando",
  deleteError: "Error eliminando"
},
departamentos: {
  title: "Departamentos",
  single: "Departamento",
  detail: "Detalle",
  iva: "IVA",
  internalTax: "Imp. Interno",
  position: "Ubicación",
  weighable: "Es pesable",
  quickAccess: "Acceso rápido",
  selectRecord: "Seleccioná un registro",
  confirmDelete: "¿Eliminar este registro?",
  inUse: "No se puede eliminar: está siendo usado por otros registros",
  pressNewOrEdit: "Primero presioná Nuevo o Modificar",
  saveError: "Error al guardar"
},
monedas: {
  title: "Monedas",
  currency: "Moneda",
  symbol: "Símbolo",
  value: "Valor",
  selectCurrency: "Seleccioná una moneda",
  sessionExpired: "Sesión expirada",
  unauthorized: "No autorizado",
  invalidData: "Datos inválidos",
  currencyNotFound: "No existe la moneda",
  formatError: "Error de formato",
  confirmDelete: "¿Eliminar moneda?",
  notFound: "No existe",
  inUse: "No se puede eliminar: está en uso"
},
marcas: {
  title: "Marcas",
  brand: "Marca",
  brandName: "Nombre de la marca",

  sessionExpired: "Sesión expirada",

  noViewPermission: "No tenés permisos para ver marcas",
  noCreatePermission: "No tenés permisos para crear marcas",
  noEditPermission: "No tenés permisos para modificar marcas",
  noDeletePermission: "No tenés permisos para eliminar marcas",

  loadError: "Error al cargar marcas",
  connectionError: "Error de conexión",

  invalidName: "Nombre inválido",

  brandNotFound: "La marca no existe",

  selectBrand: "Seleccioná una marca",

  confirmDelete: "¿Eliminar marca?",

  reload: "Recargar"
},
empresaSelect: {
  title: "Seleccioná tu empresa",

  selectCompany: "Seleccioná una empresa",
  loginFirst: "Primero iniciá sesión",

  loginSuccess: "Login exitoso ✔️",

  wrongCredentials: "PIN o contraseña incorrectos",
  forbidden: "Acceso prohibido",
  serverError: "Error del servidor",
  connectionError: "Error de conexión",

  entering: "Ingresando...",
  enter: "Ingresar"
},
sucursales: {
  title: "Sucursales",

  branch: "Sucursal",
  branchNumber: "Sucursal nro.",
  branchName: "Nombre",

  company: "Empresa",
  selectCompany: "Seleccionar empresa",

  address: "Domicilio comercial",
  email: "Correo electrónico",

  phone1: "Teléfono 1",
  phone2: "Teléfono 2",

  defaultPriceList: "Lista Predet.",

  expiredSession: "Sesión expirada",
  companiesError: "Error al obtener empresas",
  branchesError: "Error al obtener sucursales",
  serverError: "Error del servidor",

  selectBranch: "Seleccione una sucursal",

  branchUpdated: "Sucursal actualizada correctamente",
  branchCreated: "Sucursal creada correctamente",
  branchDeleted: "Sucursal eliminada correctamente",

  branchNotFound: "Sucursal no encontrada",

  invalidData: "Datos inválidos",
  invalidFormat: "Formato inválido",

  accessDenied: "Acceso denegado",
  endpointNotFound: "Endpoint no encontrado",

  updateError: "Error al actualizar sucursal",
  createError: "Error al crear sucursal",
  deleteError: "Error al eliminar sucursal",

  confirmDelete:
    "¿Desea eliminar la sucursal seleccionada?",

  linkedDeleteError:
    "No se puede eliminar porque está vinculada a otros registros",

  cannotDelete:
    "No se puede eliminar la sucursal"
},
  "otrosTributos": {
    "title": "Otros Tributos",
    "afipCode": "Código AFIP",
    "name": "Nombre",
    "type": "Tipo",
    "value": "Valor",

    "nationalTax": "Impuesto nacional",
    "provincialTax": "Impuesto provincial",
    "municipalTax": "Impuesto municipal",
    "internalTax": "Impuesto interno",
    "iibb": "Ingresos brutos",
    "ivaPerception": "Percepción de IVA",
    "iibbPerception": "Percepción de IIBB",
    "others": "Otros",

    "selectAfipCode": "Seleccionar",
    "selectRecord": "Seleccioná uno",
    "confirmDelete": "¿Eliminar?",
    "emptyName": "El nombre no puede estar vacío",
    "sessionExpired": "Sesión expirada",
    "loadError": "Error cargando datos"
  },
  "menu": {
    "home": "Inicio",
    "system": "Sistema",
    "users": "Usuarios",
    "articles": "Artículos",
    "subArticles": "Sub-Artículos",
    "combos": "Combos",
    "classifications": "Clasificaciones",
    "priceChanges": "Cambios de Precio",
    "priceLists": "Listas de Precio",
    "promotions": "Promociones",
    "sizes": "Talles",
    "colors": "Colores",
    "departments": "Departamentos",
    "subDepartments": "Subdepartamentos",
    "customers": "Clientes",
    "customerCategories": "Categorías de Clientes",
    "brands": "Marcas",
    "suppliers": "Proveedores",
    "parameters": "Parámetros",
    "company": "Empresa",
    "branches": "Sucursales",
    "terminals": "Terminales",
    "taxes": "Impuestos",
    "vat": "IVA",
    "otherTaxes": "Otros Tributos",
    "scales": "Balanzas",
    "paymentMethods": "Medios de Pago",
    "installments": "Cuotas",
    "foreignCurrency": "Monedas",
    "userRoles": "Roles de Usuario",
    "stockMovements": "Movimientos de Stock",
    "posConfiguration": "Configuración POS",
    "generalConfiguration": "Configuración General",
    "configurationWizard": "Asistente de Configuración",
    "stock": "Stock",
    "fiscal": "Fiscal",
    "myInformation": "Mi Información",
    "reports": "Reportes",
    "tools": "Herramientas",
    "statistics": "Estadísticas",
    "loggingOut": "Cerrando sesión...",
    "darkMode": "Modo Oscuro",
    "departmentsShort": "Deptos.",
      reportArticles: "Artículos",
reportLabels: "Etiquetas",
reportStock: "Stock",
reportDepartments: "Departamentos",
reportCustomers: "Clientes",
reportAccounts: "Cuentas Corrientes",
reportSales: "Ventas",
reportCash: "Caja diaria",
reportFinance: "Finanzas",
accounting: "Contable",
vatSalesJournal: "Subdiario IVA ventas",
vatRates: "IVA Alícuotas",
confirmLogout: "¿Seguro que querés cerrar sesión?",
  
},
"statistics": {
  "title": "Estadísticas",
  "subtitle": "Análisis de ventas e inventario",

  "salesToday": "Ventas Hoy",
  "ticketsToday": "Tickets Hoy",
  "averageToday": "Promedio Hoy",

  "salesMonth": "Ventas Mes",
  "ticketsMonth": "Tickets Mes",
  "averageMonth": "Promedio Mes",

  "monthlyRevenue": "Facturación por Mes",
  "paymentMethods": "Métodos de Pago",
  "criticalStock": "Stock Crítico",

  "code": "Código",
  "item": "Artículo",
  "reorderPoint": "Punto Pedido",
  "stock": "Stock",

  "loading": "Cargando estadísticas..."
},
combos: {
  title: "Combos",
  availableCombos: "Combos disponibles",
  comboData: "Datos del Combo",
  addArticle: "Agregar Artículo",
  comboDetail: "Detalle del Combo",
  comboTotal: "TOTAL DEL COMBO",
  add: "Agregar",
  comboName: "Nombre del Combo",
  finalPrice: "Precio Final",

  article: "Artículo",
  quantity: "Cantidad",
  total: "Total",
  price: "Precio",

  comboDeleted: "Combo eliminado",
  comboSaved: "Combo guardado",

  articleAdded: "Agregar",

  deleteCombo: "Eliminar combo",
  deleteAllItems: "Todos los items",
  deleteSelected: "Seleccionados",

  deleteComboQuestion: "¿Eliminar el combo completo?",
  deleteItemsQuestion: "¿Eliminar todos los artículos del combo?",

  itemDeleted: "Artículos eliminados",

  comboNotFound: "Combo no encontrado",
  articleNotFound: "Artículo no encontrado",

  selectCombo: "Seleccioná un combo",
  selectArticle: "Seleccioná al menos un artículo",
  selectComboFirst: "Primero seleccioná un combo",

  code: "Código",
  id: "ID",
  name: "Nombre"
},
"months": {
  "jan": "Ene",
  "feb": "Feb",
  "mar": "Mar",
  "apr": "Abr",
  "may": "May",
  "jun": "Jun",
  "jul": "Jul",
  "aug": "Ago",
  "sep": "Sep",
  "oct": "Oct",
  "nov": "Nov",
  "dec": "Dic"
},
"promotions": {
  "accessDenied": "Acceso denegado",
  "errorLoading": "Error al obtener promociones",
  "unauthorized": "No autorizado",
  "invalidData": "Datos inválidos. Revisá fechas o campos obligatorios.",
  "errorSaving": "Error al guardar la promoción",
  "deleted": "Promoción eliminada correctamente",
  "deleteError": "No se pudo eliminar la promoción",
  "confirmDelete": "¿Seguro que querés eliminar la promoción \"{{name}}\"?",
  "type": "Tipo",
  "name": "Nombre de la promoción",
  "typeBuyNUseList": "Más de N usa lista X",
  "typeBuyNPayM": "Llevando N paga M (2x1)",
  "typeFixedDiscount": "Porcentaje de descuento fijo",
  "typeSecondUnitDiscount": "Porc. de desc. en la 2 unidad",
  "buyQuantity": "N. Llevando",
  "discountPercentage": "% Descuento",
  "payQuantity": "Cantidad M",
  "discountAmount": "Monto descuento",
  "priceList": "Lista de precios",
  "setAvailableDays": "Establecer días vigente",
  "active": "Promo ACTIVA"
},
"days": {
  "monday": "Lunes",
  "tuesday": "Martes",
  "wednesday": "Miércoles",
  "thursday": "Jueves",
  "friday": "Viernes",
  "saturday": "Sábado",
  "sunday": "Domingo"
},
criticalProducts: "Productos críticos",
monthTickets: "Tickets del Mes",
registeredSales: "Ventas registradas",
todaySales: "Ventas Hoy",
tickets: "tickets",
average: "Promedio",
reorderPoint: "Punto Pedido",

businessSummary: "Resumen Comercial",

todayRevenue: "Facturación Hoy",
monthSalesCount: "Ventas del Mes",
monthRevenue: "Facturación Mensual",

ivaAlicuotas: {
  title: "IVA Ventas Alícuotas",
  subtitle: "Detalle de ventas por alícuota de IVA",

  from: "Desde",
  to: "Hasta",
  list: "Listar",
  exit: "Salir",

  date: "Fecha",
  legalName: "Razón Social",
  document: "DNI",
  type: "Tipo",
  comp: "Comp",
  invoice: "Comprobante",
  taxableAmount: "Neto Gravado",
  vatRate: "IVA %",
  vatAmount: "IVA Importe",
  cae: "CAE",

  noData: "No hay datos para mostrar",

  exportExcel: "Exportar Excel",
  print: "Imprimir",
  pdf: "PDF",

  search: "Buscar...",

  previous: "Anterior",
  next: "Siguiente",
  page: "Página",

  taxableSales: "Ventas Gravadas",
  vat: "IVA",
  totalSales: "Total Ventas",
of: "de",
  generatedBy: "Reporte generado por BRUKI"
}
  },
  en: {
    common: {
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      search: "Search",
      add: "Add",
      close: "Close",
      loading: "Loading...",
      new: "New",
      duplicate: "Duplicate",
      exit: "Exit",
      code: "Code",
      name: "Name",
      id: "ID",
      select: "Select",
      none: "None",
      list: "List",
      all:"All",
    },
    "promotions": {
  "accessDenied": "Access denied",
  "errorLoading": "Error loading promotions",
  "unauthorized": "Unauthorized",
  "invalidData": "Invalid data. Check the dates and required fields.",
  "errorSaving": "Error saving promotion",
  "deleted": "Promotion deleted successfully",
  "deleteError": "Could not delete the promotion",
  "confirmDelete": "Are you sure you want to delete the promotion \"{{name}}\"?",
  "type": "Promotion Type",
  "name": "Promotion Name",
  "typeBuyNUseList": "Buy more than N, use price list X",
  "typeBuyNPayM": "Buy N, Pay M (2x1)",
  "typeFixedDiscount": "Fixed Discount Percentage",
  "typeSecondUnitDiscount": "Second Item Discount Percentage",
  "buyQuantity": "Buy Quantity",
  "discountPercentage": "Discount %",
  "payQuantity": "Pay Quantity",
  "discountAmount": "Discount Amount",
  "priceList": "Price List",
  "setAvailableDays": "Set available days",
  "active": "Promotion ACTIVE"
},
"days": {
  "monday": "Monday",
  "tuesday": "Tuesday",
  "wednesday": "Wednesday",
  "thursday": "Thursday",
  "friday": "Friday",
  "saturday": "Saturday",
  "sunday": "Sunday"
},
combos: {
  title: "Combos",
  availableCombos: "Available Combos",
  comboData: "Combo Information",
  addArticle: "Add Item",
  comboDetail: "Combo Details",
  comboTotal: "COMBO TOTAL",
add: "Add",
  comboName: "Combo Name",
  finalPrice: "Final Price",

  article: "Item",
  quantity: "Quantity",
  total: "Total",
  price: "Price",

  comboDeleted: "Combo deleted",
  comboSaved: "Combo saved",

  articleAdded: "Add",

  deleteCombo: "Delete combo",
  deleteAllItems: "All items",
  deleteSelected: "Selected",

  deleteComboQuestion: "Delete the entire combo?",
  deleteItemsQuestion: "Delete all items from the combo?",

  itemDeleted: "Items deleted",

  comboNotFound: "Combo not found",
  articleNotFound: "Item not found",

  selectCombo: "Select a combo",
  selectArticle: "Select at least one item",
  selectComboFirst: "Select a combo first",

  code: "Code",
  id: "ID",
  name: "Name"
},
    dashboard: {
      hello: "Hello",
      welcome: "Welcome to the administration panel",
      articles: "Articles",
      clients: "Clients",
      branches: "Branches",
      stock: "Stock",
      prices: "Prices",
      logout: "Logout"
    },

    login: {
      title: "Bruki Backoffice",
      subtitle: "Sign in with your account",
      pin: "PIN",
      password: "Password",
      login: "Login",
      quickAccess: "Quick Access"
    },

    articulos: {
      title: "Articles",
      newArticle: "New Article",
      barcode: "Barcode",
      name: "Name",
      price: "Price",
      stock: "Stock"
    },

    usuarios: {
      title: "Users",
      newUser: "New User",
      role: "Role"
    },

    sucursales: {
      title: "Branches",
      newBranch: "New Branch"
    },
    clasificaciones: {
  title: "Classifications"
},
suppliers: {
  title: "Suppliers",
  selectSupplier: "Select a supplier",
  selectOne: "Select one",
  confirmDelete: "Delete supplier?",
  companyName: "Company name",
  company: "Company",
  cuit: "Tax ID",
  address: "Address",
  phone: "Phone",
  email: "Email",
  description: "Description",
  currency: "Currency",
  selectCurrency: "Select currency"
},
subdepartamentos: {
  title: "Sub-Departments",
  single: "SubDepartment",
  completeData: "Complete the data",
  selectRecord: "Select a record",
  confirmDelete: "Delete?",
  saveError: "Error saving",
  deleteError: "Error deleting"
},
departamentos: {
  title: "Departments",
  single: "Department",
  detail: "Description",
  iva: "VAT",
  internalTax: "Internal Tax",
  position: "Position",
  weighable: "Weighable",
  quickAccess: "Quick Access",
  selectRecord: "Select a record",
  confirmDelete: "Delete this record?",
  inUse: "Cannot delete: it is being used by other records",
  pressNewOrEdit: "Press New or Edit first",
  saveError: "Error saving"
},
monedas: {
  title: "Currencies",
  currency: "Currency",
  symbol: "Symbol",
  value: "Value",
  selectCurrency: "Select a currency",
  sessionExpired: "Session expired",
  unauthorized: "Unauthorized",
  invalidData: "Invalid data",
  currencyNotFound: "Currency does not exist",
  formatError: "Format error",
  confirmDelete: "Delete currency?",
  notFound: "Does not exist",
  inUse: "Cannot delete: it is in use"
},
marcas: {
  title: "Brands",
  brand: "Brand",
  brandName: "Brand name",

  sessionExpired: "Session expired",

  noViewPermission: "You do not have permission to view brands",
  noCreatePermission: "You do not have permission to create brands",
  noEditPermission: "You do not have permission to edit brands",
  noDeletePermission: "You do not have permission to delete brands",

  loadError: "Error loading brands",
  connectionError: "Connection error",

  invalidName: "Invalid name",

  brandNotFound: "Brand does not exist",

  selectBrand: "Select a brand",

  confirmDelete: "Delete brand?",

  reload: "Reload"
},
empresaSelect: {
  title: "Select your company",

  selectCompany: "Select a company",
  loginFirst: "Please sign in first",

  loginSuccess: "Login successful ✔️",

  wrongCredentials: "Incorrect PIN or password",
  forbidden: "Access denied",
  serverError: "Server error",
  connectionError: "Connection error",

  entering: "Signing in...",
  enter: "Enter"
},
sucursales: {
  title: "Branches",

  branch: "Branch",
  branchNumber: "Branch No.",
  branchName: "Name",

  company: "Company",
  selectCompany: "Select company",

  address: "Business address",
  email: "Email",

  phone1: "Phone 1",
  phone2: "Phone 2",

  defaultPriceList: "Default price list",

  expiredSession: "Session expired",
  companiesError: "Error loading companies",
  branchesError: "Error loading branches",
  serverError: "Server error",

  selectBranch: "Select a branch",

  branchUpdated: "Branch updated successfully",
  branchCreated: "Branch created successfully",
  branchDeleted: "Branch deleted successfully",

  branchNotFound: "Branch not found",

  invalidData: "Invalid data",
  invalidFormat: "Invalid format",

  accessDenied: "Access denied",
  endpointNotFound: "Endpoint not found",

  updateError: "Error updating branch",
  createError: "Error creating branch",
  deleteError: "Error deleting branch",

  confirmDelete:
    "Do you want to delete the selected branch?",

  linkedDeleteError:
    "Cannot delete because it is linked to other records",

  cannotDelete:
    "Cannot delete branch"
    
},
  "otrosTributos": {
    "title": "Other Taxes",
    "afipCode": "AFIP Code",
    "name": "Name",
    "type": "Type",
    "value": "Value",

    "nationalTax": "National Tax",
    "provincialTax": "Provincial Tax",
    "municipalTax": "Municipal Tax",
    "internalTax": "Internal Tax",
    "iibb": "Gross Income Tax",
    "ivaPerception": "VAT Perception",
    "iibbPerception": "Gross Income Tax Perception",
    "others": "Others",

    "selectAfipCode": "Select",
    "selectRecord": "Select a record",
    "confirmDelete": "Delete?",
    "emptyName": "Name cannot be empty",
    "sessionExpired": "Session expired",
    "loadError": "Error loading data"
  },
  "menu": {
    "home": "Home",
    "system": "System",
    "users": "Users",
    "articles": "Items",
    "subArticles": "Sub Items",
    "combos": "Combos",
    "classifications": "Classifications",
    "priceChanges": "Price Changes",
    "priceLists": "Price Lists",
    "promotions": "Promotions",
    "sizes": "Sizes",
    "colors": "Colors",
    "departments": "Departments",
    "subDepartments": "Sub Departments",
    "customers": "Customers",
    "customerCategories": "Customer Categories",
    "brands": "Brands",
    "suppliers": "Suppliers",
    "parameters": "Parameters",
    "company": "Company",
    "branches": "Branches",
    "terminals": "Terminals",
    "taxes": "Taxes",
    "vat": "VAT",
    "otherTaxes": "Other Taxes",
    "scales": "Scales",
    "paymentMethods": "Payment Methods",
    "installments": "Installments",
    "foreignCurrency": "Currencies",
    "userRoles": "User Roles",
    "stockMovements": "Stock Movements",
    "posConfiguration": "POS Configuration",
    "generalConfiguration": "General Configuration",
    "configurationWizard": "Configuration Wizard",
    "stock": "Stock",
    "fiscal": "Fiscal",
    "myInformation": "My Information",
    "reports": "Reports",
    "tools": "Tools",
    "statistics": "Statistics",
    "loggingOut": "Logging out...",
    "darkMode": "Dark Mode",
    "departmentsShort": "Depts.",
    reportArticles: "Articles",
reportLabels: "Labels",
reportStock: "Stock",
reportDepartments: "Departments",
reportCustomers: "Customers",
reportAccounts: "Accounts Receivable",
reportSales: "Sales",
reportCash: "Daily Cash",
reportFinance: "Finance",
accounting: "Accounting",
vatSalesJournal: "VAT Sales Journal",
vatRates: "VAT Rates",
confirmLogout: "Are you sure you want to log out?",
},
"statistics": {
  "title": "Statistics",
  "subtitle": "Sales and Inventory Analysis",

  "salesToday": "Today's Sales",
  "ticketsToday": "Today's Tickets",
  "averageToday": "Today's Average",

  "salesMonth": "Monthly Sales",
  "ticketsMonth": "Monthly Tickets",
  "averageMonth": "Monthly Average",

  "monthlyRevenue": "Revenue by Month",
  "paymentMethods": "Payment Methods",
  "criticalStock": "Critical Stock",

  "code": "Code",
  "item": "Item",
  "reorderPoint": "Reorder Point",
  "stock": "Stock",

  "loading": "Loading statistics..."
},

"months": {
  "jan": "Jan",
  "feb": "Feb",
  "mar": "Mar",
  "apr": "Apr",
  "may": "May",
  "jun": "Jun",
  "jul": "Jul",
  "aug": "Aug",
  "sep": "Sep",
  "oct": "Oct",
  "nov": "Nov",
  "dec": "Dec"
},
criticalProducts: "Critical Products",
monthTickets: "Monthly Tickets",
registeredSales: "Registered Sales",
todaySales: "Today's Sales",
tickets: "tickets",
average: "Average",
reorderPoint: "Reorder Point",

businessSummary: "Business Summary",

todayRevenue: "Today's Revenue",
monthSalesCount: "Monthly Sales",
monthRevenue: "Monthly Revenue",

ivaAlicuotas: {
  title: "VAT Sales Rates",
  subtitle: "Sales detail by VAT rate",

  from: "From",
  to: "To",
  list: "Search",
  exit: "Exit",

  date: "Date",
  legalName: "Business Name",
  document: "ID",
  type: "Type",
  comp: "Doc.",
  invoice: "Invoice",
  taxableAmount: "Taxable Amount",
  vatRate: "VAT %",
  vatAmount: "VAT Amount",
  cae: "CAE",

  noData: "No data available",

  exportExcel: "Export Excel",
  print: "Print",
  pdf: "PDF",

  search: "Search...",

  previous: "Previous",
  next: "Next",
  page: "Page",

  taxableSales: "Taxable Sales",
  vat: "VAT",
  totalSales: "Total Sales",
of: "of",
  generatedBy: "Report generated by BRUKI"
}
},

  pt: {
    common: {
      save: "Salvar",
      cancel: "Cancelar",
      delete: "Excluir",
      edit: "Editar",
      search: "Buscar",
      add: "Adicionar",
      close: "Fechar",
      loading: "Carregando...",
      new: "Novo",
      duplicate: "Duplicar",
      exit: "Sair",
      code: "Código",
      name: "Nome",
      id: "ID",
      select: "Selecionar",
      none: "Nenhum",
      list: "Lista",
      all: "Tudo",
    },

    dashboard: {
      hello: "Olá",
      welcome: "Bem-vindo ao painel administrativo",
      articles: "Artigos",
      clients: "Clientes",
      branches: "Filiais",
      stock: "Estoque",
      prices: "Preços",
      logout: "Sair"
    },

    login: {
      title: "Bruki Backoffice",
      subtitle: "Entre com sua conta",
      pin: "PIN",
      password: "Senha",
      login: "Entrar",
      quickAccess: "Acesso Rápido"
    },

    articulos: {
      title: "Artigos",
      newArticle: "Novo Artigo",
      barcode: "Código de Barras",
      name: "Nome",
      price: "Preço",
      stock: "Estoque"
    },

    usuarios: {
      title: "Usuários",
      newUser: "Novo Usuário",
      role: "Função"
    },

    sucursales: {
      title: "Filiais",
      newBranch: "Nova Filial"
    },
    clasificaciones: {
  title: "Classificações"
},
suppliers: {
  title: "Fornecedores",
  selectSupplier: "Selecione um fornecedor",
  selectOne: "Selecione um",
  confirmDelete: "Excluir fornecedor?",
  companyName: "Razão social",
  company: "Empresa",
  cuit: "CUIT",
  address: "Endereço",
  phone: "Telefone",
  email: "Email",
  description: "Descrição",
  currency: "Moeda",
  selectCurrency: "Selecionar moeda"
},
subdepartamentos: {
  title: "Subdepartamentos",
  single: "Subdepartamento",
  completeData: "Preencha os dados",
  selectRecord: "Selecione um registro",
  confirmDelete: "Excluir?",
  saveError: "Erro ao salvar",
  deleteError: "Erro ao excluir"
},
departamentos: {
  title: "Departamentos",
  single: "Departamento",
  detail: "Descrição",
  iva: "IVA",
  internalTax: "Imposto Interno",
  position: "Posição",
  weighable: "Pesável",
  quickAccess: "Acesso Rápido",
  selectRecord: "Selecione um registro",
  confirmDelete: "Excluir este registro?",
  inUse: "Não é possível excluir: está sendo usado por outros registros",
  pressNewOrEdit: "Primeiro pressione Novo ou Editar",
  saveError: "Erro ao salvar"
},
"promotions": {
  "accessDenied": "Acesso negado",
  "errorLoading": "Erro ao carregar promoções",
  "unauthorized": "Não autorizado",
  "invalidData": "Dados inválidos. Verifique as datas e os campos obrigatórios.",
  "errorSaving": "Erro ao salvar a promoção",
  "deleted": "Promoção removida com sucesso",
  "deleteError": "Não foi possível remover a promoção",
  "confirmDelete": "Tem certeza de que deseja remover a promoção \"{{name}}\"?",
  "type": "Tipo de Promoção",
  "name": "Nome da Promoção",
  "typeBuyNUseList": "Compre mais de N e use a lista X",
  "typeBuyNPayM": "Leve N e pague M (2x1)",
  "typeFixedDiscount": "Percentual de desconto fixo",
  "typeSecondUnitDiscount": "Desconto percentual na segunda unidade",
  "buyQuantity": "Qtd. Comprada",
  "discountPercentage": "% Desconto",
  "payQuantity": "Qtd. Paga",
  "discountAmount": "Valor do desconto",
  "priceList": "Lista de Preços",
  "setAvailableDays": "Definir dias de vigência",
  "active": "Promoção ATIVA"
},
"days": {
  "monday": "Segunda-feira",
  "tuesday": "Terça-feira",
  "wednesday": "Quarta-feira",
  "thursday": "Quinta-feira",
  "friday": "Sexta-feira",
  "saturday": "Sábado",
  "sunday": "Domingo"
},
monedas: {
  title: "Moedas",
  currency: "Moeda",
  symbol: "Símbolo",
  value: "Valor",
  selectCurrency: "Selecione uma moeda",
  sessionExpired: "Sessão expirada",
  unauthorized: "Não autorizado",
  invalidData: "Dados inválidos",
  currencyNotFound: "A moeda não existe",
  formatError: "Erro de formato",
  confirmDelete: "Excluir moeda?",
  notFound: "Não existe",
  inUse: "Não é possível excluir: está em uso"
},
marcas: {
  title: "Marcas",
  brand: "Marca",
  brandName: "Nome da marca",

  sessionExpired: "Sessão expirada",

  noViewPermission: "Você não tem permissão para visualizar marcas",
  noCreatePermission: "Você não tem permissão para criar marcas",
  noEditPermission: "Você não tem permissão para editar marcas",
  noDeletePermission: "Você não tem permissão para excluir marcas",

  loadError: "Erro ao carregar marcas",
  connectionError: "Erro de conexão",

  invalidName: "Nome inválido",

  brandNotFound: "A marca não existe",

  selectBrand: "Selecione uma marca",

  confirmDelete: "Excluir marca?",

  reload: "Recarregar"
},
empresaSelect: {
  title: "Selecione sua empresa",

  selectCompany: "Selecione uma empresa",
  loginFirst: "Faça login primeiro",

  loginSuccess: "Login realizado com sucesso ✔️",

  wrongCredentials: "PIN ou senha incorretos",
  forbidden: "Acesso negado",
  serverError: "Erro do servidor",
  connectionError: "Erro de conexão",

  entering: "Entrando...",
  enter: "Entrar"
},
sucursales: {
  title: "Filiais",

  branch: "Filial",
  branchNumber: "Nº da filial",
  branchName: "Nome",

  company: "Empresa",
  selectCompany: "Selecionar empresa",

  address: "Endereço comercial",
  email: "E-mail",

  phone1: "Telefone 1",
  phone2: "Telefone 2",

  defaultPriceList: "Lista padrão",

  expiredSession: "Sessão expirada",
  companiesError: "Erro ao obter empresas",
  branchesError: "Erro ao obter filiais",
  serverError: "Erro do servidor",

  selectBranch: "Selecione uma filial",

  branchUpdated: "Filial atualizada com sucesso",
  branchCreated: "Filial criada com sucesso",
  branchDeleted: "Filial removida com sucesso",

  branchNotFound: "Filial não encontrada",

  invalidData: "Dados inválidos",
  invalidFormat: "Formato inválido",

  accessDenied: "Acesso negado",
  endpointNotFound: "Endpoint não encontrado",

  updateError: "Erro ao atualizar filial",
  createError: "Erro ao criar filial",
  deleteError: "Erro ao excluir filial",

  confirmDelete:
    "Deseja excluir a filial selecionada?",

  linkedDeleteError:
    "Não é possível excluir porque está vinculada a outros registros",

  cannotDelete:
    "Não é possível excluir a filial"
},
  "otrosTributos": {
    "title": "Outros Tributos",
    "afipCode": "Código AFIP",
    "name": "Nome",
    "type": "Tipo",
    "value": "Valor",

    "nationalTax": "Imposto Nacional",
    "provincialTax": "Imposto Provincial",
    "municipalTax": "Imposto Municipal",
    "internalTax": "Imposto Interno",
    "iibb": "Receita Bruta",
    "ivaPerception": "Percepção de IVA",
    "iibbPerception": "Percepção de Receita Bruta",
    "others": "Outros",

    "selectAfipCode": "Selecionar",
    "selectRecord": "Selecione um registro",
    "confirmDelete": "Excluir?",
    "emptyName": "O nome não pode estar vazio",
    "sessionExpired": "Sessão expirada",
    "loadError": "Erro ao carregar dados"
  },
  "menu": {
    "home": "Início",
    "system": "Sistema",
    "users": "Usuários",
    "articles": "Artigos",
    "subArticles": "Subartigos",
    "combos": "Combos",
    "classifications": "Classificações",
    "priceChanges": "Alterações de Preço",
    "priceLists": "Listas de Preço",
    "promotions": "Promoções",
    "sizes": "Tamanhos",
    "colors": "Cores",
    "departments": "Departamentos",
    "subDepartments": "Subdepartamentos",
    "customers": "Clientes",
    "customerCategories": "Categorias de Clientes",
    "brands": "Marcas",
    "suppliers": "Fornecedores",
    "parameters": "Parâmetros",
    "company": "Empresa",
    "branches": "Filiais",
    "terminals": "Terminais",
    "taxes": "Impostos",
    "vat": "IVA",
    "otherTaxes": "Outros Tributos",
    "scales": "Balanças",
    "paymentMethods": "Formas de Pagamento",
    "installments": "Parcelas",
    "foreignCurrency": "Moedas",
    "userRoles": "Funções de Usuário",
    "stockMovements": "Movimentações de Estoque",
    "posConfiguration": "Configuração POS",
    "generalConfiguration": "Configuração Geral",
    "configurationWizard": "Assistente de Configuração",
    "stock": "Estoque",
    "fiscal": "Fiscal",
    "myInformation": "Minhas Informações",
    "reports": "Relatórios",
    "tools": "Ferramentas",
    "statistics": "Estatísticas",
    "loggingOut": "Saindo...",
    "darkMode": "Modo Escuro",
    "departmentsShort": "Deptos.",
          reportArticles: "Artigos",
    reportLabels: "Etiquetas",
    reportStock: "Estoque",
  reportDepartments: "Departamentos",
  reportCustomers: "Clientes",
  reportAccounts: "Contas Correntes",
  reportSales: "Vendas",
  reportCash: "Caixa Diário",
  reportFinance: "Finanças",
  accounting: "Contábil",
  vatSalesJournal: "Livro de IVA de Vendas",
  vatRates: "Alíquotas de IVA",
  confirmLogout: "Tem certeza de que deseja sair?",
  },
  "statistics": {
  "title": "Estatísticas",
  "subtitle": "Análise de vendas e estoque",

  "salesToday": "Vendas Hoje",
  "ticketsToday": "Cupons Hoje",
  "averageToday": "Média Hoje",

  "salesMonth": "Vendas do Mês",
  "ticketsMonth": "Cupons do Mês",
  "averageMonth": "Média do Mês",

  "monthlyRevenue": "Faturamento por Mês",
  "paymentMethods": "Métodos de Pagamento",
  "criticalStock": "Estoque Crítico",

  "code": "Código",
  "item": "Artigo",
  "reorderPoint": "Ponto de Reposição",
  "stock": "Estoque",

  "loading": "Carregando estatísticas..."
},

"months": {
  "jan": "Jan",
  "feb": "Fev",
  "mar": "Mar",
  "apr": "Abr",
  "may": "Mai",
  "jun": "Jun",
  "jul": "Jul",
  "aug": "Ago",
  "sep": "Set",
  "oct": "Out",
  "nov": "Nov",
  "dec": "Dez"
},
criticalProducts: "Produtos Críticos",
monthTickets: "Tickets do Mês",
registeredSales: "Vendas Registradas",
todaySales: "Vendas Hoje",
tickets: "tickets",
average: "Média",
reorderPoint: "Ponto de Pedido",

businessSummary: "Resumo Comercial",

todayRevenue: "Faturamento Hoje",
monthSalesCount: "Vendas do Mês",
monthRevenue: "Faturamento Mensal",

ivaAlicuotas: {
  title: "Alíquotas de Vendas",
  subtitle: "Detalhe das vendas por alíquota de imposto",

  from: "De",
  to: "Até",
  list: "Listar",
  exit: "Sair",

  date: "Data",
  legalName: "Razão Social",
  document: "CPF/CNPJ",
  type: "Tipo",
  comp: "Comp.",
  invoice: "Comprovante",
  taxableAmount: "Valor Tributável",
  vatRate: "Imposto %",
  vatAmount: "Valor do Imposto",
  cae: "CAE",

  noData: "Nenhum dado disponível",

  exportExcel: "Exportar Excel",
  print: "Imprimir",
  pdf: "PDF",

  search: "Pesquisar...",

  previous: "Anterior",
  next: "Próximo",
  page: "Página",

  taxableSales: "Vendas Tributáveis",
  vat: "Imposto",
  totalSales: "Total de Vendas",
of: "de",
  generatedBy: "Relatório gerado pelo BRUKI",
},
combos: {
  title: "Combos",
  availableCombos: "Combos disponíveis",
  comboData: "Dados do Combo",
  addArticle: "Adicionar Artigo",
  comboDetail: "Detalhes do Combo",
  comboTotal: "TOTAL DO COMBO",

  comboName: "Nome do Combo",
  finalPrice: "Preço Final",

  article: "Artigo",
  quantity: "Quantidade",
  total: "Total",
  price: "Preço",
  add: "Adicionar",
  comboDeleted: "Combo excluído",
  comboSaved: "Combo salvo",

  articleAdded: "Adicionar",

  deleteCombo: "Excluir combo",
  deleteAllItems: "Todos os itens",
  deleteSelected: "Selecionados",

  deleteComboQuestion: "Excluir o combo completo?",
  deleteItemsQuestion: "Excluir todos os artigos do combo?",

  itemDeleted: "Artigos excluídos",

  comboNotFound: "Combo não encontrado",
  articleNotFound: "Artigo não encontrado",

  selectCombo: "Selecione um combo",
  selectArticle: "Selecione pelo menos um artigo",
  selectComboFirst: "Selecione um combo primeiro",

  code: "Código",
  id: "ID",
  name: "Nome"
},
  },
};