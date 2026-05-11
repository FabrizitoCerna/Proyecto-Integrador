const API_URL = "http://192.168.18.10:8080";

// 🔐 LOGIN
export const loginUser = async (email: string, password: string) => {
  try {
    console.log("URL:", `${API_URL}/usuarios/login`);

    const response = await fetch(`${API_URL}/usuarios/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    console.log("STATUS:", response.status);

    const text = await response.text();
    console.log("RAW RESPONSE:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!response.ok) {
      return { error: true, message: data };
    }

    return { error: false, data };

  } catch (error) {
    console.log("ERROR COMPLETO:", error);
    return { error: true, message: "Error de conexión" };
  }
};


// 📝 REGISTRO
export const registerUser = async (
  nombre: string,
  email: string,
  password: string
) => {
  try {
    const response = await fetch(`${API_URL}/usuarios/registro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre,
        email,
        password,
        tipo: "cliente",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: true, message: data };
    }

    return { error: false, data };

  } catch (error) {
    console.log("ERROR:", error);
    return { error: true, message: "Error de conexión" };
  }
};