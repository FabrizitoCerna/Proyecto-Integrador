const API_URL = "http://192.168.18.10:8080";

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

    const text = await response.text(); // 👈 primero como texto
    console.log("RAW RESPONSE:", text);

    let data;
    try {
      data = JSON.parse(text); // 👈 intenta convertir a JSON
    } catch {
      data = text;
    }

    if (!response.ok) {
      return { error: true, message: data };
    }

    return { error: false, data };

  } catch (error) {
    console.log("ERROR COMPLETO:", error);
    return { error: true, message: "Error des conexión" };
  }
};