import { Button } from "primereact/button";
import TituloAdmin from "../tituloAdmin";
import { useEffect, useState } from "react";
import { Message } from "primereact/message";
import Modal from "../modal";
import CreadorFormularios from "../CreadorFormularios";
import global from "@/js/jsons/global";
import { agregarCero, cumplioEstructura, limpiarCaracteres, logE, obtenerFecha, validarEstructura, validarFormulario } from "@/js/scrips";
import ListadoUsuario from "../listadoUsuario";
import { Checkbox } from "primereact/checkbox";
import { servicesPole } from "@/service/api";
import { useGlobalStore } from "@/stores/itemStore";
import { InputText } from "primereact/inputtext";
const fNuevaClase = [
    { id: "actual", type: "calendar", title: "", classDiv: "col col-12 max-width", placeholder: "fecha", classLabel: "d-none" },
]
const templateReserva = { ...global.creadorReserva, actual: new Date(), actualI: null, actualF: null, rango: [] }
const modalDefecto = { activar: false, header: "Nueva reserva", style: { width: "50%", margin: "auto" }, class: "bg-admin modal-container" }
var reservaGlobal = []
export default function Reservaciones(props) {
    const [Formulario, setFormulario] = useState(templateReserva)
    const [ModalC, setModalC] = useState(modalDefecto)
    const [Listado, setListado] = useState([]);
    const [Horario, setHorario] = useState({});
    const [Reservas, setReservas] = useState([]);
    const [Todos, setTodos] = useState(false);
    const { data, addData } = useGlobalStore();

    const accionesServicio = async (tipo, datos) => {
        let res = {}
        let nuevo = {}
        switch (tipo) {
            case "registrar":
                nuevo.claseId = Formulario.data._id
                nuevo.fecha = Formulario.fechaValores.actual
                nuevo.hora = Formulario.data.hora
                nuevo.asistieron = Listado
                console.log("38", nuevo);
                res = await servicesPole.reservaciones.registrarReservaciones(nuevo)

                break;
            case "actualizar":
                res = await servicesPole.reservaciones.reactivarReservaciones(Formulario.nuevo.id)
                break;
            case "cancelar":
                let idReserva = ""
                Reservas.forEach(e => {
                    if (e.alumno._id == data.sesion._id) {
                        idReserva = e._id
                    }
                });
                res = await servicesPole.reservaciones.cancelarReservaciones(idReserva)
                // console.log("32", Reservas, idReserva);
                break;
            case "crear":
                nuevo.alumno = data.sesion._id
                nuevo.clase = Formulario.data._id
                nuevo.fecha = Formulario.fechaValores.actual
                nuevo.hora = Formulario.data.hora
                // console.log("28", nuevo, obternerMesYear(), Formulario);
                res = await servicesPole.reservaciones.crearReservaciones(nuevo)
                break;

            default:
                break;
        }
        return res
    }
    const acciones = async ({ tipo = "crear", template = templateReserva, formulario = [], mensaje = "" } = {}) => {
        addData("load", { activo: true, mensaje: "Cargando..." })
        let res = validarEstructura(template, Formulario)
        let validacionFormulario = validarFormulario(formulario, Formulario)
        // console.log("68", res, validacionFormulario);
        if (cumplioEstructura(res) && validacionFormulario.length == 0) {
            try {
                await accionesServicio(tipo, res.value)
                addData("load", { activo: false, mensaje: "Cargando..." })
                addData("notificacion", { severity: 'success', summary: 'Acción completada', detail: mensaje, life: 3000 })
                setModalC(modalDefecto)
                obtenerFechaSemana()
            } catch (error) {
                addData("load", { activo: false, mensaje: "Cargando..." })
                console.log(error);
                addData("notificacion", { severity: 'error', summary: 'Hubo un problema', detail: 'Usuario o contraseña incorrectos', life: 3000 })
            }
        } else {
            addData("load", { activo: false, mensaje: "Cargando..." })
            addData("notificacion", { severity: 'error', summary: 'Hubo un problema', detail: validacionFormulario[0]?.mensaje, life: 3000 })
        }
    }
    const accionesGlobal = (tipo) => {
        switch (tipo) {
            case "registrarAsistencia":
                acciones({ tipo: "registrar", mensaje: "Asistencia registrada" })
                break;
            case "cancelarClase":
                acciones({ tipo: "cancelar", mensaje: "Reserva cancelada" })
                break;
            case "actualizarReservacion":
                acciones({ tipo: "actualizar", mensaje: "Reserva actualizada" })
                break;
            case "crearReservacion":
                acciones({ tipo: "crear", mensaje: "Reserva realizada" })
                break;

            default:
                break;
        }
    }
    const seleccionUnica = (e) => {
        let _Listado = [...Listado];

        if (e.checked)
            _Listado?.push(e.value);
        else
            _Listado?.splice(_Listado?.indexOf(e.value), 1);
        // console.log(_Listado);
        setListado(_Listado);
    }
    const clase = (data, dia) => {
        // console.log("66", data);
        return (
            <div className="w-100">
                <p className="m-0">{data?.nombre}</p>
                <p className="m-0 fz-12">{"Duración:" + data?.duracion + " min"}</p>
                <p className="m-0 fz-12">{"Inicio de clase:" + data?.hora}</p>
                <p className="m-0 fz-12">{"Min:" + data?.capacidadMin + " - Max:" + data?.capacidad}</p>
            </div>
        )
    }
    function obtenerDiasEnRango(fechaInicio, fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        const dias = [];

        // Clonar para no modificar la original
        let actuals = new Date(inicio);

        while (actuals <= fin) {
            dias.push(actuals.getDate()); // solo el número de día

            // avanzar 1 día
            actuals.setDate(actuals.getDate() + 1);
        }

        return dias;
    }
    const ordenarHorarios = (clases) => {
        const diasSemana = [
            "lunes",
            "martes",
            "miercoles",
            "jueves",
            "viernes",
            "sabado",
            "domingo"
        ];

        const resultado = {};
        diasSemana.forEach(dia => resultado[dia] = []);

        clases.forEach(clase => {
            clase.horarios.forEach(({ dia, horas }) => {
                if (!resultado[dia]) return;
                horas.forEach(hora => {
                    resultado[dia].push({
                        ...clase,
                        hora, // 🔥 importante
                    });
                });
            });
        });

        // 🔥 ordenar por hora
        Object.keys(resultado).forEach(dia => {
            resultado[dia].sort((a, b) => {
                const [h1, m1] = a.hora.split(":").map(Number);
                const [h2, m2] = b.hora.split(":").map(Number);

                return (h1 * 60 + m1) - (h2 * 60 + m2);
            });
        });

        return resultado;
    };
    const obtenerFechaSemana = async (accion) => {
        let clas = await servicesPole.clases.consultarClases()
        let actualI, actualF, inicioSemana, finSemana
        if (accion == 2) {
            inicioSemana = obtenerFecha({ date: Formulario?.actual }).inicioSemana
            finSemana = obtenerFecha({ date: Formulario?.actual }).finSemana
        } else {
            inicioSemana = obtenerFecha({ date: Formulario?.actualI }).inicioSemana
            finSemana = obtenerFecha({ date: Formulario?.actualF }).finSemana
        }
        switch (accion) {
            case 2:
                // console.log("67", );
                setFormulario({ ...Formulario, actualI: inicioSemana, actualF: finSemana, rango: obtenerDiasEnRango(inicioSemana, finSemana) })
                break;
            case 1:
                let siguiente = finSemana.setDate(finSemana.getDate() + 1);
                actualI = obtenerFecha({ date: new Date(siguiente) }).inicioSemana
                actualF = obtenerFecha({ date: new Date(siguiente) }).finSemana
                // logE({ donde: "87 obtenerFechaSemana", env: "todos", mensaje: [new Date(siguiente), actualI, actualF] })
                setFormulario({ ...Formulario, actualI: actualI, actualF: actualF, rango: obtenerDiasEnRango(actualI, actualF) })
                break;
            case 0:
                let anteriror = inicioSemana.setDate(inicioSemana.getDate() - 1);
                actualI = obtenerFecha({ date: new Date(anteriror) }).inicioSemana
                actualF = obtenerFecha({ date: new Date(anteriror) }).finSemana
                setFormulario({ ...Formulario, actualI: actualI, actualF: actualF, rango: obtenerDiasEnRango(actualI, actualF) })
                break;
            default:
                break;
        }
        setHorario(ordenarHorarios(clas.data))
    }
    const seleccioTodo = () => {
        let arr = []
        if (!Todos) {
            Reservas.forEach(e => {
                arr.push(e._id)
            });
        } else {
            arr = []
        }
        // console.log(arr);
        setListado(arr)
        setTodos(!Todos)

    }
    const obternerMesYear = (diaS) => {
        const fecha = new Date();
        const mes = agregarCero(fecha.getMonth() + 1); // getMonth() va de 0 a 11
        const anio = fecha.getFullYear();
        const dia = agregarCero(diaS) ?? agregarCero(Formulario?.dia)
        return { mes: mes, anio: anio, dia: dia, actual: anio + "-" + mes + "-" + dia, vista: dia + "/" + mes + "/" + anio }
    }


    // Ejemplo
    // console.log(obtenerDiaSemana("2026-05-11")); // lunes
    const reservarClase = async (datos, fecha) => {
        try {
            // console.log("247", datos);

            let resercionesHoy = []
            let asistencia = []
            let reserva = false
            let nuevo = { estado: true, id: "" }
            let fechaO = obternerMesYear(fecha)
            let reservaLista = await servicesPole.reservaciones.consultarReservaciones(datos._id, fechaO.actual)

            reservaLista.data.forEach(e => {
                if (e?.alumno?._id == data.sesion._id) {
                    nuevo.estado = false
                    nuevo.id = e._id
                }
                if (e.estado !== "cancelado") {
                    resercionesHoy.push(e)
                }
                if (e.estado == "asistio") {
                    asistencia.push(e._id)
                }
            });
            // console.log("248", data);
            resercionesHoy?.forEach(e => {
                if (e?.alumno?._id == data.sesion._id) {
                    reserva = true
                }
            });
            reservaGlobal = resercionesHoy
            // console.log(nuevo);
            setTodos([])
            setListado(asistencia)
            setReservas(resercionesHoy)
            setModalC({ ...ModalC, activar: true, header: datos?.nombre })
            setFormulario({ ...Formulario, data: datos, vistaDia: fechaO.vista, reserva: reserva, fechaValores: fechaO, nuevo: nuevo })
        } catch (error) {
            console.log("247", error);
        }

    }
    const buscarAlumnos = (valor) => {
        // setTimeout(() => {
        // }, 100);
        let val = valor?.target?.value
        // console.log("267", valor.target.value);
        if (!val) setReservas([...reservaGlobal]);
        const filterValue = val.toLowerCase().trim();
        // const fields = getDynamicFilterFields(data);
        // console.log("65", filterValue, fields, data);
        let resultado = []
        reservaGlobal.forEach(e => {
            let objT = limpiarCaracteres(JSON.stringify(e), { caracteresAConservar: [" ", "$", "%", "-", ":", "/", "?", "=", "_"] })
            if (objT.toLowerCase().includes(filterValue)) {
                resultado.push(e)
            }
        });
        // console.log("73", resultado);
        // return resultado
        setReservas(resultado)
    }
    useEffect(() => {
        obtenerFechaSemana(2)
        // console.log(global.Horario);
    }, [Formulario?.actual])
    return (
        <div>
            <Modal data={ModalC} control={setModalC}>
                {/* {console.log(data.sesion, Formulario)} */}
                <div className="row">
                    <div className="col col-12 col-md-4">
                        <div className="card card-efect p-3 text-center">
                            <strong>Confirmados</strong>
                            <span className="text-success fz-30">{Reservas.length}</span>
                        </div>
                    </div>
                    <div className="col col-12 col-md-4">
                        <div className="card card-efect p-3 text-center">
                            <strong>Cantidad minima</strong>
                            <span className="text-warning fz-30">{Formulario?.data?.capacidadMin}</span>
                        </div>
                    </div>
                    <div className="col col-12 col-md-4">
                        <div className="card card-efect p-3 text-center">
                            <strong>Faltantes</strong>
                            <span className="text-danger fz-30">{Formulario?.data?.capacidadMin - Reservas.length}</span>
                        </div>
                    </div>
                    <div className="col col-12 col-md-4 pt-3">
                        <p className="m-0"><span className="text-dual me-2 pi pi-calendar"></span>{Formulario?.vistaDia}</p>
                        <p className="m-0"><span className="text-dual me-2 pi pi-clock"></span>{Formulario?.data?.hora}</p>
                        <p className="m-0"><span className="text-dual me-2 pi pi-user"></span>{Formulario?.data?.instructor?.nombre}</p>
                        <p className="m-0"><span className="text-dual me-2 pi pi-users"></span>Capaciad maxima: {Formulario?.data?.capacidad}</p>
                    </div>
                    <div className="mt-3 col-12 col-md-8 text-center">
                        {(data?.sesion?._id == Formulario?.data?.instructor?._id) ?
                            <div>
                                <Message text={"Marca las asistencias de tus alumnos utilizando los checks"} className={""} severity="warn" />
                                {/* <p>Marca las asistencias de tus alumnos utilizando los checks</p> */}
                            </div> :
                            <div>
                                {!Formulario.reserva ?
                                    Formulario?.data?.capacidad >= Reservas.length &&
                                    <div>
                                        <p>Preciona para reservar esta clase</p>
                                        <Button severity="success" className="btn btn-success m-auto" label="Confirmar asistencia" text icon="pi pi-check" onClick={() => Formulario.nuevo.estado ? accionesGlobal("crearReservacion") : accionesGlobal("actualizarReservacion")} />
                                    </div> :
                                    <div>
                                        <p>Preciona para cancelar tu asistencia a esta clase</p>
                                        <Button severity="danger" className="btn btn-danger m-auto" label="Cancelar asistencia" text icon="pi pi-check" onClick={() => accionesGlobal("cancelarClase")} />
                                    </div>
                                }
                            </div>
                        }
                    </div>

                    <div className="col col-12 col-md-8">
                        <strong>Reservaciones ({Reservas.length}/{Formulario?.data?.capacidad})</strong>
                    </div>
                    {(data?.sesion?.rol == "admin" || (data?.sesion?._id == Formulario?.data?.instructor?._id)) &&
                        <div className="col col-12 col-md-4 text-end pe-3">
                            <span>Marcar asistencia todos</span>
                            <Checkbox inputId="ingredient2" name="lista" onChange={seleccioTodo} checked={Todos} className="ms-2" />
                        </div>
                    }
                </div>
                <div className="flex justify-between items-center">
                    <span className="p-input-icon-left w-100">
                        <i className="pi pi-search ps-3" />
                        <InputText
                            // value={""}
                            onChange={(e) => buscarAlumnos(e)}
                            placeholder="Buscar..."
                            className="p-inputtext-sm ps-5"
                        />
                    </span>
                </div>
                <div className="listado-usuarios mb-5">
                    {Reservas?.map((e, i) => {
                        return (
                            <div key={"list" + i} className="mt-2 card-efect">
                                <ListadoUsuario item={e} control={seleccionUnica} data={Listado} permisos={data?.sesion?.rol} />
                            </div>
                        )
                    })}
                </div>
                {(data?.sesion?.rol == "admin" || (data?.sesion?._id == Formulario?.data?.instructor?._id)) &&
                    <div className="acciones-modal d-flex text-end">
                        <Button label="Cancelar" className="br-15 me-2 ms-auto" severity="secondary" text raised onClick={() => setModalC({ ...ModalC, activar: false, tipo: "crear" })} />
                        <Button label={"Registrar"} className="btn btn-dual br-15" onClick={() => accionesGlobal("registrarAsistencia")} />
                    </div>
                }
            </Modal>
            <div className="row">
                <div className="col col-12 col-md-6">
                    <TituloAdmin titulo={"Reservaciones"} descripcion={"Gestiona reservas y asistencia de clases"} />
                </div>
                <div className="col col-12 col-md-6 text-end d-flex align-items-center">
                    <div className="ms-auto">
                        <CreadorFormularios
                            key="formulario-calendario"
                            campos={fNuevaClase}
                            datos={Formulario}
                            control={setFormulario}
                        />
                    </div>
                </div>
                <div className="col col-4 text-start"><Button className="br-15" label="Semnana anterior" severity="secondary" text icon="pi pi-angle-left" onClick={() => obtenerFechaSemana(0)} /></div>
                <div className="col col-4 centrar">
                    <strong className="mt-2">{obtenerFecha({ date: Formulario?.actualI })?.reverso + " - " + obtenerFecha({ date: Formulario?.actualF })?.reverso}</strong>
                </div>
                <div className="col col-4 text-end"><Button className="br-15" label="Semnana siguiente" severity="secondary" text icon="pi pi-angle-right" iconPos="right" onClick={() => obtenerFechaSemana(1)} /></div>
            </div>

            <div className="row">
                <div className="m-hr wp-12 card p-3">
                    <p className="m-0">Lunes</p>
                    <p className="m-0"><strong>{Formulario?.rango?.[0]}</strong></p>
                    {Horario?.lunes?.map((e, i) => {
                        return (
                            <div key={"lunes-" + i} className="pointer">
                                <Message text={() => clase(e, "lunes")} className={e?.color + " br-15 clases-semana card-efect w-100 mt-2"} onClick={() => reservarClase(e, Formulario?.rango?.[0])} />
                            </div>
                        )
                    })}
                </div>
                <div className="m-hr wp-12 card p-3">
                    <p className="m-0">Martes</p>
                    <p className="m-0"><strong>{Formulario?.rango?.[1]}</strong></p>
                    {Horario?.martes?.map((e, i) => {
                        return (
                            <div key={"martes-" + i} className="pointer">
                                <Message text={() => clase(e, "martes")} className={e?.color + " br-15 clases-semana card-efect w-100 mt-2"} onClick={() => reservarClase(e, Formulario?.rango?.[1])} />
                            </div>
                        )
                    })}
                </div>
                <div className="m-hr wp-12 card p-3">
                    <p className="m-0">Miercoles</p>
                    <p className="m-0"><strong>{Formulario?.rango?.[2]}</strong></p>
                    {Horario?.miercoles?.map((e, i) => {
                        return (
                            <div key={"miercoles-" + i} className="pointer">
                                <Message text={() => clase(e, "miercoles")} className={e?.color + " br-15 clases-semana card-efect w-100 mt-2"} onClick={() => reservarClase(e, Formulario?.rango?.[2])} />
                            </div>
                        )
                    })}
                </div>
                <div className="m-hr wp-12 card p-3">
                    <p className="m-0">Jueves</p>
                    <p className="m-0"><strong>{Formulario?.rango?.[3]}</strong></p>
                    {Horario?.jueves?.map((e, i) => {
                        return (
                            <div key={"jueves-" + i} className="pointer">
                                <Message text={() => clase(e, "jueves")} className={e?.color + " br-15 clases-semana card-efect w-100 mt-2"} onClick={() => reservarClase(e, Formulario?.rango?.[3])} />
                            </div>
                        )
                    })}
                </div>
                <div className="m-hr wp-12 card p-3">
                    <p className="m-0">Viernes</p>
                    <p className="m-0"><strong>{Formulario?.rango?.[4]}</strong></p>
                    {Horario?.viernes?.map((e, i) => {
                        return (
                            <div key={"viernes-" + i} className="pointer">
                                <Message text={() => clase(e, "viernes")} className={e?.color + " br-15 clases-semana card-efect w-100 mt-2"} onClick={() => reservarClase(e, Formulario?.rango?.[4])} />
                            </div>
                        )
                    })}
                </div>
                <div className="m-hr wp-12 card p-3">
                    <p className="m-0">Sabado</p>
                    <p className="m-0"><strong>{Formulario?.rango?.[5]}</strong></p>
                    {Horario?.sabado?.map((e, i) => {
                        return (
                            <div key={"sabado-" + i} className="pointer">
                                <Message text={() => clase(e, "sabado")} className={e?.color + " br-15 clases-semana card-efect w-100 mt-2"} onClick={() => reservarClase(e, Formulario?.rango?.[5])} />
                            </div>
                        )
                    })}
                </div>
                <div className="m-hr wp-12 card p-3">
                    <p className="m-0">Domingo</p>
                    <p className="m-0"><strong>{Formulario?.rango?.[6]}</strong></p>
                    {Horario?.domingo?.map((e, i) => {
                        return (
                            <div key={"domingo-" + i} className="pointer">
                                <Message text={() => clase(e, "domingo")} className={e?.color + " br-15 clases-semana card-efect w-100 mt-2"} onClick={() => reservarClase(e, Formulario?.rango?.[6])} />
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    )
}