import { generarRandom } from "../scrips"

const global = {
    creadorUsuarios: {
        activo: true,
        nombre: "",
        apellidos: "",
        email: "",
        telefono: "",
        fechaNacimiento: new Date(),
        condiciones: "",
        alerjias: "",
        lesiones: "",
        medicamento: "",
        contactoEmergencia: "",
        notas: "",
        rol: "alumno",
        password: "1234",
        especialidades: []
    },
    creadorClases: {
        nombre: "",
        descripcion: "",
        dia: "",
        hora: "",
        duracion: 0,
        capacidad: 0,
        horarios: [],
        capacidadMin: 0,
        instructor: "",
        activa: true,
        color: ""
    },
    creadorReserva:
    {
        usuario_id: 0,
        clase_id: 0,
        fecha: "",
        hora: ""
    },
    creadorProducto:
    {
        nombre: "",
        estado: "disponible",
        descripcion: "",
        cantidad: 0,
        precioCompra: 0,
        precio: 0,
        talla: [],
        color: [],
        categoria: ["Fisico", "Linea"],
        fechaCompra: new Date()
    },
    crearPlan: {
        nombre: "",
        precio: 0,
        duracion: 0,
        clases: 0,
        descripcion: "",
    },
    crearCupon: {
        nombre: "",
        codigo: generarRandom(8),
        fechaInicio: new Date(),
        fechaFin: new Date(),
        usos: 0,
        descuento: "porcentaje",
        aplica: "clase",
        cantidad: 0,
        descripcion: "",
    },
    crearPago: {
        // usuario: "",
        metodoPago: "",
        // items: [],
        notas: ""
    },

    Horario: [
        {
            lunes: { id: "0", color: "color1", clase: "Yoga", horario: "17:00", lugares: "10", maestro: "Maestro 1", fecha: "Lunes 23 de Marzo" },
            martes: { id: "1", color: "color2", clase: "Acrobacia en tela", horario: "09:00", lugares: "10", maestro: "Maestro 1", fecha: "Lunes 23 de Marzo" },
            miercoles: { id: "2", color: "color3", clase: "Pole exotic", horario: "16:00", lugares: "10", maestro: "Maestro 1", fecha: "Lunes 23 de Marzo" },
            jueves: { id: "3", color: "color4", clase: "Aerial kids", horario: "16:30", lugares: "10", maestro: "Maestro 1", fecha: "Lunes 23 de Marzo" },
            viernes: { id: "4", color: "color1", clase: "Yoga", horario: "08:30", lugares: "10", maestro: "Maestro 1", fecha: "Lunes 23 de Marzo" },
            sabado: { id: "5", color: "color5", clase: "Pole fitnnes", horario: "08:30", lugares: "10", maestro: "Maestro 1", fecha: "Lunes 23 de Marzo" },
            domingo: { id: "6", color: "color5", clase: "Pole fitnnes", horario: "08:00", lugares: "10", maestro: "Maestro 1", fecha: "Lunes 23 de Marzo" },
        },
        {
            lunes: { id: "7", color: "color5", clase: "Pole fitnnes", horario: "18:15", lugares: "10", maestro: "Maestro 1", fecha: "Lunes 23 de Marzo" },
            martes: { id: "8", color: "color6", clase: "Hammok / Acrobacia en tela", horario: "18:15", lugares: "10", maestro: "Maestro 1", fecha: "Lunes 23 de Marzo" },
            miercoles: { id: "9", color: "color7", clase: "Yoga con pelota", horario: "17:45", lugares: "10", maestro: "Maestro 1", fecha: "Lunes 23 de Marzo" },
            jueves: { id: "10", color: "color2", clase: "Acrobacia en tela", horario: "18:15", lugares: "10", maestro: "Maestro 1", fecha: "Lunes 23 de Marzo" },
            viernes: { id: "11", color: "color8", clase: "Acrobacia en tela / Aro aereo", horario: "09:45", lugares: "10", maestro: "Maestro 1", fecha: "Lunes 23 de Marzo" },
            sabado: { id: "12", color: "color9", clase: "Hells", horario: "10:15", lugares: "10", maestro: "Maestro 1", fecha: "Lunes 23 de Marzo" },
            domingo: { id: "13", color: "color3", clase: "Pole exotic", horario: "09:45", lugares: "10", maestro: "Maestro 1", fecha: "Lunes 23 de Marzo" },
        },
        {
            lunes: { id: "14", color: "color10", clase: "Twerk", horario: "20:15", lugares: "10", maestro: "Maestro 1", fecha: "Lunes 23 de Marzo" },
            martes: { id: "15", color: "color2", clase: "Acrobacia en tela", horario: "20:00", lugares: "10", maestro: "Maestro 1", fecha: "Lunes 23 de Marzo" },
            miercoles: { id: "", color: "", clase: "", horario: "", lugares: "", maestro: "", fecha: "" },
            jueves: { id: "17", color: "color2", clase: "Acrobacia en tela", horario: "20:00", lugares: "10", maestro: "Maestro 1", fecha: "Lunes 23 de Marzo" },
            viernes: { id: "18", color: "color4", clase: "Aerial kids", horario: "16:30", lugares: "10", maestro: "Maestro 1", fecha: "Lunes 23 de Marzo" },
            sabado: { id: "19", color: "color11", clase: "Yoga flow", horario: "11:30", lugares: "10", maestro: "Maestro 1", fecha: "Lunes 23 de Marzo" },
            domingo: { id: "20", color: "color8", clase: "Acrobacia en tela / Aro aereo", horario: "11:15", lugares: "10", maestro: "Maestro 1", fecha: "Lunes 23 de Marzo" },
        },
        {
            lunes: { id: "22", color: "", clase: "", horario: "", lugares: "", maestro: "", fecha: "" },
            martes: { id: "23", color: "", clase: "", horario: "", lugares: "", maestro: "", fecha: "" },
            miercoles: { id: "24", color: "", clase: "", horario: "", lugares: "", maestro: "", fecha: "" },
            jueves: { id: "25", color: "", clase: "", horario: "", lugares: "", maestro: "", fecha: "" },
            viernes: { id: "21", color: "color5", clase: "Pole fitnnes", horario: "18:15", lugares: "10", maestro: "Maestro 1", fecha: "Lunes 23 de Marzo" },
            sabado: { id: "26", color: "", clase: "", horario: "", lugares: "", maestro: "", fecha: "" },
            domingo: { id: "27", color: "", clase: "", horario: "", lugares: "", maestro: "", fecha: "" },
        }
    ],
    administradores: [
        { id: 1, nombre: "Héctor Eduardo González Luna", telefono: "5532994205", correo: "lyon1589@gmail.com", direccion: "Direccion", estado: "Activo" },
    ],
    alumnos: [
        { id: 1, nombre: "Brenda Paola Godoy Rosas", edad: "31", prefijo: "PA", clase: "Pole exotic", reserva: "21 mar 2026", estado: "Asistio" },
        { id: 2, nombre: "Héctor Eduardo González Luna", edad: "31", prefijo: "HE", clase: "Telas", reserva: "21 mar 2026", estado: "Pendiente" },
        { id: 3, nombre: "Person 1", edad: "31", prefijo: "P1", clase: "Hells", reserva: "21 mar 2026", estado: "Falta" }
    ],
    instructor: [
        { id: 1, nombre: "Instructor 1", correo: "instructor1@gmail.com", telefono: "5532994208", tags: ["Pole dance", "Pole exotic"], descripcion: "esta es la descripcion" }
    ],
    clases: [
        { id: "Yoga", nombre: "Yoga" },
        { id: "Pole fitnnes", nombre: "Pole fitnnes" },
        { id: "Twerk", nombre: "Twerk" },
        { id: "Acrobacia en telas", nombre: "Acrobacia en telas" },
        { id: "Hammok", nombre: "Hammok" },
        { id: "Pole exotic", nombre: "Pole exotic" },
        { id: "Aerial kids", nombre: "Aerial kids" },
        { id: "Hells", nombre: "Hells" },
        { id: "Yoga con pelota", nombre: "Yoga con pelota" },
        { id: "Yoga flow", nombre: "Yoga flow" },
    ],
    pagos: [
        { id: 0, fecha: "22 feb 2026", estudiante: "Desconocido", tipo: "Membresia", metodo: "Efectivo", estado: "Pendiente", monto: 1200 },
        { id: 1, fecha: "26 feb 2026", estudiante: "Brenda Paola Godoy Rosas", tipo: "Clase", metodo: "Tarjeta", estado: "Completado", monto: 400 }
    ],
    planes: [
        { id: 0, plan: "Enero", precio: 400, dias: 30, clases: 10, descripcion: "este campo es de descripcion de cosas" }
    ],
    promociones: [
        { id: 0, promocion: "Navidad", codigo: "DUALNK151S", descripcion: "descripcion de la promocion", fechaIncio: "2026-12-01", fechaFin: "2026-12-31", compraMinima: 1, usos: 10, estatus: true, descuento: 10 }
    ],
    productos: [
        { id: 0, producto: "Barra de Pole 45mm", descripcion: "Barra profesional de pole dance", categoria: "Equipamento", cantidad: 2, estado: "Bueno", ubicacion: "Sala principal", precio: "8000", }
    ]
}
export default global