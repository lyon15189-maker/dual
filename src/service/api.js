import axios from 'axios';

function cerrarSesion() {
  console.log("32 cerrarSesion api");
  location.href = "http://localhost:3000/acceso"
  // setTimeout(() => {
  // }, 1000);
}
const api = axios.create({
  // baseURL: Config.urlJava
  baseURL: "http://localhost:3001/"
});

// 🔥 interceptor global
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

async function consulta({ url = "", body = "", config = {}, why = "", base = api } = {}) {
  try {
    const response = await base.get(url, config)
    // console.log('48:', response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Response data:", error.response);
      if (error?.response?.data?.message == "Token inválido") {
        console.log(error?.response?.data?.message);
        cerrarSesion()
      }
    }
    throw error;
  }
}
async function enviar({ url = "", body = "", config = {}, base = api, redirect = true } = {}) {
  // console.log(url);
  try {
    let response = await base.post(url, body, config);
    // console.log("74:", response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Response data:", error.response);
      if (error?.response?.data?.message == "Token inválido") {
        console.log(error?.response?.data?.message);
        cerrarSesion()
      }
    }
    throw error;
  }
}
async function editar({ url = "", body = "", base = api, redirect = true, config = {} } = {}) {
  try {
    const response = await base.put(url, body, config);
    // console.log('ObtenerEmpresas response:', response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // console.log("Response data:", error.response);
      if (error?.response?.data?.message == "Token inválido") {
        console.log(error?.response?.data?.message);
        cerrarSesion()
      }
      if (axios.isAxiosError(error) && error?.response) {
        throw error?.response
      }
    }
    throw error;
  }
}
async function eliminar({ url = "", body = "", why = "", base = api, config = {} } = {}) {
  try {
    const response = await base.delete(url, config);
    // console.log('ObtenerEmpresas response:', response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Response data:", error.response);
      if (error?.response?.data?.message == "Token inválido") {
        console.log(error?.response?.data?.message);
        cerrarSesion()
      }
    }
    throw error;
  }
}

export const servicesPole = {
  home: {
    iniciarSesion: async (obj) => {
      const res = await enviar({ url: "/api/auth/login", body: obj });
      const token = res.data.token;
      const user = res.data.user;
      // 🔥 guardar token
      localStorage.setItem("usuario", JSON.stringify(user));
      localStorage.setItem("token", token);
      return res
    }
  },
  dashboard: {
    consultarDashboard: async () => {
      return consulta({ url: "/api/users/dashboard", why: "ObtenerModulos" })
    },
    ObtenerUsuarios: async ({ roles = "admin,maestro,alumno,cliente", activo = true } = {}) => {
      return consulta({ url: "/api/users?roles=" + roles, why: "ObtenerModulos" })
    },
    ObtenerUnUsuario: async (id) => {
      return consulta({ url: "/api/users/" + id })
    },
    crearUsuarios: async (obj) => {
      return enviar({ url: "/api/users", body: obj })
    },
    editarUsuarios: async (obj, id) => {
      return editar({ url: "/api/users/" + id, body: obj })
    },
    eliminarUsuarios: async (id) => {
      return eliminar({ url: "/api/users/" + id })
    },
  },
  clases: {
    consultarClases: async () => {
      return consulta({ url: "/api/clases" })
    },
    crearClases: async (obj) => {
      return enviar({ url: "/api/clases", body: obj })
    },
    editarClases: async (obj, id) => {
      return editar({ url: "/api/clases/" + id, body: obj })
    },
    eliminarClases: async (id) => {
      return eliminar({ url: "/api/clases/" + id })
    }
  },
  reservaciones: {
    consultarReservaciones: async (id, fecha) => {
      return consulta({ url: "/api/reservas?clase=" + id + "&fecha=" + fecha })
    },
    consultarAsistencia: async (id, fecha, hora) => {
      return consulta({ url: "/api/reservas/asistencia?claseId=" + id + "&fecha=" + fecha + "&hora=" + hora })
    },
    crearReservaciones: async (obj) => {
      return enviar({ url: "/api/reservas", body: obj })
    },
    cancelarReservaciones: async (id) => {
      return editar({ url: "/api/reservas/" + id + "/cancelar" })
    },
    reactivarReservaciones: async (id) => {
      return editar({ url: "/api/reservas/" + id + "/reactivar" })
    },
    asistioReservaciones: async (id) => {
      return editar({ url: "/api/reservas/" + id + "/asistio" })
    },
    faltaReservaciones: async (id) => {
      return editar({ url: "/api/reservas/" + id + "/falta" })
    },
    registrarReservaciones: async (obj) => {
      return editar({ url: "/api/reservas/asistencia/masiva", body: obj })
    },
    eliminarReservaciones: async (id) => {
      return eliminar({ url: "/api/reservas/" + id })
    }
  },
  productos: {
    consultarProductosTienda: async (tipo) => {
      return consulta({ url: "/api/productos?categoria=" + tipo })
    },
    consultarUnProducto: async (id) => {
      return consulta({ url: "/api/productos/" + id })
    },
    consultarProductos: async () => {
      return consulta({ url: "/api/productos" })
    },
    crearProductos: async (obj) => {
      return enviar({ url: "/api/productos", body: obj })
    },
    editarProductos: async (id, obj) => {
      return editar({ url: "/api/productos/" + id, body: obj })
    },
    eliminarProductos: async (id) => {
      return eliminar({ url: "/api/productos/" + id })
    }
  },
  plan: {
    consultarPlanes: async () => {
      return consulta({ url: "/api/planes" })
    },
    crearPlanes: async (obj) => {
      return enviar({ url: "/api/planes", body: obj })
    },
    editarPlanes: async (id, obj) => {
      return editar({ url: "/api/planes/" + id, body: obj })
    },
    eliminarPlanes: async (id) => {
      return eliminar({ url: "/api/planes/" + id })
    }
  },
  cupones: {
    consultarCupones: async () => {
      return consulta({ url: "/api/cupones" })
    },
    consultarCuponesFiltro: async (filtro) => {
      return consulta({ url: "/api/cupones?" + filtro })
    },
    crearCupones: async (obj) => {
      return enviar({ url: "/api/cupones", body: obj })
    },
    editarCupones: async (id, obj) => {
      return editar({ url: "/api/cupones/" + id, body: obj })
    },
    eliminarCupones: async (id) => {
      return eliminar({ url: "/api/cupones/" + id })
    }
  },
  pagos: {
    consultarPagosUsuario: async (fi, ff, usuario) => {
      return consulta({ url: "/api/pagos?fechaInicio=" + fi + "&fechaFin=" + ff + "&usuario=" + usuario })
    },
    consultarPagos: async (fi, ff) => {
      return consulta({ url: "/api/pagos?fechaInicio=" + fi + "&fechaFin=" + ff })
    },
    consultarResumen: async (fi, ff) => {
      return consulta({ url: "/api/pagos/resumen?fechaInicio=" + fi + "&fechaFin=" + ff })
    },
    crearPagos: async (obj) => {
      return enviar({ url: "/api/pagos", body: obj })
    },
    cancelarPagos: async (id) => {
      return editar({ url: "/api/pagos/" + id + "/cancelar" })
    },
    activarPagos: async (id) => {
      return editar({ url: "/api/pagos/" + id + "/reactivar" })
    },
    validarPagos: async (id) => {
      return editar({ url: "/api/pagos/" + id + "/validar" })
    },
    eliminarPagos: async (id) => {
      return eliminar({ url: "/api/pagos/" + id })
    }
  },
  carrito: {
    consultarCarrito: async () => {
      return consulta({ url: "/api/carrito" })
    },
    crearCarrito: async (obj) => {
      return enviar({ url: "/api/carrito", body: obj })
    },
    actualizarCantidadCarrito: async (obj) => {
      return editar({ url: "/api/carrito/", body: obj })
    },
    editarCarrito: async (id, obj) => {
      return editar({ url: "/api/carrito/" + id, body: obj })
    },
    eliminarProducto: async (id) => {
      return eliminar({ url: "/api/carrito/" + id })
    },
    vaciarCarrito: async () => {
      return eliminar({ url: "/api/carrito" })
    }
  }
};