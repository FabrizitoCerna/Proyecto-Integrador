
const API_URL = "http://10.77.193.202:8080";

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

  } catch (error) {
    return { error: true, message: "Error de conexión" };
  }
};

// 📝 REGISTRO CLIENTE
export const registerCliente = async (
  nombre: string,
  email: string,
  password: string,
  dni: string,
  telefono: string
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

  } catch (error) {
    return { error: true, message: "Error de conexión" };
  }
};

// 📝 REGISTRO ESPECIALISTA
export const registerEspecialista = async (
  nombre: string,
  email: string,
  password: string,
  dni: string,
  telefono: string,
  descripcion: string,
  precioReferencial: number,
  distrito: string,
  categoriaIds: number[]
) => {
  try {
    // Paso 1: registrar usuario
    const resUsuario = await fetch(`${API_URL}/usuarios/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password, dni, telefono, tipo: "especialista" })
    });

    const textUsuario = await resUsuario.text();
    let dataUsuario;
    try { dataUsuario = JSON.parse(textUsuario); } catch { dataUsuario = textUsuario; }

    if (!resUsuario.ok) return { error: true, message: dataUsuario };

    // Paso 2: crear perfil especialista
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

  } catch (error) {
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
  } catch (error) {
    return { error: true, message: "Error de conexión" };
  }
};