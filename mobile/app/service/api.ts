const API_URL = "http://192.168.18.161:8080";

// 🔐 LOGIN
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    if (!response.ok) return { error: true, message: data };
    return { error: false, data };
  } catch {
    return { error: true, message: "Error de conexión" };
  }
};

// 📝 REGISTRO CLIENTE
export const registerCliente = async (
  nombre: string, email: string, password: string,
  dni: string, telefono: string
) => {
  try {
    const response = await fetch(`${API_URL}/usuarios/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password, dni, telefono, tipo: "cliente" })
    });
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    if (!response.ok) return { error: true, message: data };
    return { error: false, data };
  } catch {
    return { error: true, message: "Error de conexión" };
  }
};

// 📝 REGISTRO ESPECIALISTA
export const registerEspecialista = async (
  nombre: string, email: string, password: string,
  dni: string, telefono: string, descripcion: string,
  precioReferencial: number, distrito: string, categoriaIds: number[]
) => {
  try {
    const resUsuario = await fetch(`${API_URL}/usuarios/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password, dni, telefono, tipo: "especialista" })
    });
    const textUsuario = await resUsuario.text();
    let dataUsuario;
    try { dataUsuario = JSON.parse(textUsuario); } catch { dataUsuario = textUsuario; }
    if (!resUsuario.ok) return { error: true, message: dataUsuario };

    const usuarioId = dataUsuario.id;
    const resEspecialista = await fetch(`${API_URL}/especialistas/crear/${usuarioId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ descripcion, precioReferencial, distrito, categoriaIds })
    });
    const textEsp = await resEspecialista.text();
    let dataEsp;
    try { dataEsp = JSON.parse(textEsp); } catch { dataEsp = textEsp; }
    if (!resEspecialista.ok) return { error: true, message: dataEsp };
    return { error: false, data: dataEsp };
  } catch {
    return { error: true, message: "Error de conexión" };
  }
};

// 📋 OBTENER CATEGORÍAS
export const getCategorias = async () => {
  try {
    const response = await fetch(`${API_URL}/especialistas/categorias`);
    const data = await response.json();
    if (!response.ok) return { error: true, message: data };
    return { error: false, data };
  } catch {
    return { error: true, message: "Error de conexión" };
  }
};

// 📝 CREAR SOLICITUD
export const crearSolicitud = async (
  clienteId: number, categoriaId: number,
  descripcion: string, direccion: string
) => {
  try {
    const response = await fetch(`${API_URL}/solicitudes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clienteId, categoriaId, descripcion, direccion })
    });
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    if (!response.ok) return { error: true, message: data };
    return { error: false, data };
  } catch {
    return { error: true, message: "Error de conexión" };
  }
};

// 📋 SOLICITUDES DEL CLIENTE
export const getSolicitudesCliente = async (clienteId: number) => {
  try {
    const response = await fetch(`${API_URL}/solicitudes/cliente/${clienteId}`);
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    if (!response.ok) return { error: true, message: data };
    return { error: false, data };
  } catch {
    return { error: true, message: "Error de conexión" };
  }
};

// 📋 SOLICITUDES PARA ESPECIALISTA
export const getSolicitudesEspecialista = async (usuarioId: number) => {
  try {
    const response = await fetch(`${API_URL}/solicitudes/especialista/${usuarioId}`);
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    if (!response.ok) return { error: true, message: data };
    return { error: false, data };
  } catch {
    return { error: true, message: "Error de conexión" };
  }
};

// 💰 CREAR OFERTA
export const crearOferta = async (
  solicitudId: number, usuarioId: number,
  precio: number, mensaje: string
) => {
  try {
    const response = await fetch(`${API_URL}/ofertas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ solicitudId, usuarioId, precio, mensaje })
    });
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    if (!response.ok) return { error: true, message: data };
    return { error: false, data };
  } catch {
    return { error: true, message: "Error de conexión" };
  }
};

// 📋 OFERTAS DE UNA SOLICITUD
export const getOfertasSolicitud = async (solicitudId: number) => {
  try {
    const response = await fetch(`${API_URL}/ofertas/solicitud/${solicitudId}`);
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    if (!response.ok) return { error: true, message: data };
    return { error: false, data };
  } catch {
    return { error: true, message: "Error de conexión" };
  }
};

// ✅ ACEPTAR OFERTA
export const aceptarOferta = async (ofertaId: number) => {
  try {
    const response = await fetch(`${API_URL}/ofertas/${ofertaId}/aceptar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    if (!response.ok) return { error: true, message: data };
    return { error: false, data };
  } catch {
    return { error: true, message: "Error de conexión" };
  }
};

// 🚀 INICIAR SERVICIO
export const iniciarServicio = async (solicitudId: number, usuarioId: number) => {
  try {
    const response = await fetch(`${API_URL}/solicitudes/${solicitudId}/iniciar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuarioId })
    });
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    if (!response.ok) return { error: true, message: data };
    return { error: false, data };
  } catch {
    return { error: true, message: "Error de conexión" };
  }
};

// ✅ FINALIZAR SERVICIO
export const finalizarServicio = async (solicitudId: number, usuarioId: number) => {
  try {
    const response = await fetch(`${API_URL}/solicitudes/${solicitudId}/finalizar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuarioId })
    });
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    if (!response.ok) return { error: true, message: data };
    return { error: false, data };
  } catch {
    return { error: true, message: "Error de conexión" };
  }
};

// ⭐ RESEÑAS DE UN ESPECIALISTA (id de su usuario)
export const getResenasEspecialista = async (usuarioId: number) => {
  try {
    const response = await fetch(`${API_URL}/calificaciones/especialista/${usuarioId}`);
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    if (!response.ok) return { error: true, message: data };
    return { error: false, data };
  } catch {
    return { error: true, message: "Error de conexión" };
  }
};

// 📊 HISTORIAL DEL ESPECIALISTA (servicios completados + ganancias)
export const getHistorialEspecialista = async (usuarioId: number) => {
  try {
    const response = await fetch(`${API_URL}/especialistas/${usuarioId}/historial`);
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    if (!response.ok) return { error: true, message: data };
    return { error: false, data };
  } catch {
    return { error: true, message: "Error de conexión" };
  }
};

// ⭐ CALIFICAR SERVICIO
export const calificarServicio = async (
  solicitudId: number, clienteId: number,
  estrellas: number, comentario: string
) => {
  try {
    const response = await fetch(`${API_URL}/calificaciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ solicitudId, clienteId, estrellas, comentario })
    });
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    if (!response.ok) return { error: true, message: data };
    return { error: false, data };
  } catch {
    return { error: true, message: "Error de conexión" };
  }
};
export default {};