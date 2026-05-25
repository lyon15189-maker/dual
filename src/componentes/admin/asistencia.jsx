import { Button } from "primereact/button";
import TituloAdmin from "../tituloAdmin";
import { useEffect, useState } from "react";
import CreadorFormularios from "../CreadorFormularios";
import global from "@/js/jsons/global";
import { cumplioEstructura, logE, obtenerFecha, obtenerIdsArreglo, PrimeraMayuscula, validarEstructura, validarFormulario } from "@/js/scrips";
import ListadoUsuario from "../listadoUsuario";
import TablaPersonaliza from "../TablaPersonaliza";
import SinContenido from "../sinContendio";
import TableConfig from "@/js/clases/POOTabla";
import { Tag } from "primereact/tag";
import { servicesPole } from "@/service/api";
import { Avatar } from "primereact/avatar";
import { useGlobalStore } from "@/stores/itemStore";
const fNuevaClase = [
    { id: "hoy", type: "calendar", title: "", classDiv: "col col-12 col-md-6 max-width", placeholder: "fecha", classLabel: "d-none" },
    { id: "clase", type: "select", title: "Rol", classDiv: "col col-12 col-md-6", options: [], optionValue: "_id", optionLabel: "nombre", classLabel: "d-none", required: true },
]
const templateRespuesta = { hoy: new Date(), clase: "" }
export default function Asistencia() {
    // const [Tab, setTab] = useState({ labels: ["Horario semanal", "Lista de clases"], index: 0 });
    const [Tabla, setTabla] = useState(null)
    const [Seleccionados, setSeleccionados] = useState([])
    const [Formulario, setFormulario] = useState(templateRespuesta)
    const [Estadisticas, setEstadisticas] = useState(null);
    const { data, addData } = useGlobalStore();
    const accionesServicio = async (tipo, datos) => {
        let res = {}
        switch (tipo) {
            case "falta":
                res = servicesPole.reservaciones.faltaReservaciones(Seleccionados[0]._id)
                console.log("35", res);
                break;
            case "asistencia":
                // console.log("28", Seleccionados, Formulario);
                res = servicesPole.reservaciones.asistioReservaciones(Seleccionados[0]._id)
                break;

            default:
                break;
        }
        return res
    }
    const acciones = async ({ tipo = "crear", template = templateRespuesta, formulario = [], mensaje = "" } = {}) => {
        addData("load", { activo: true, mensaje: "Cargando..." })
        let res = validarEstructura(template, Formulario)
        let validacionFormulario = validarFormulario(formulario, Formulario)
        // console.log("68", res, validacionFormulario);
        if (cumplioEstructura(res) && validacionFormulario.length == 0) {
            try {
                await accionesServicio(tipo, res.value)
                addData("load", { activo: false, mensaje: "Cargando..." })
                addData("notificacion", { severity: 'success', summary: 'Acción completada', detail: mensaje, life: 3000 })
                Tabla.getConfig().selectedRows.length = 0
                crearTabla(Formulario.hoy, Formulario.clase)
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
    const crearTabla = async (dia, clase) => {
        try {
            let fecha = obtenerFecha({ date: dia, separador: "-" }).formato
            let idClase = clase
            let listaAsistencia = await servicesPole.reservaciones.consultarReservaciones(idClase, fecha)

            let estadisticas = {
                total: listaAsistencia.data.length,
                asistio: 0,
                falto: 0,
            };

            listaAsistencia.data.forEach(e => {
                if (e.estado === "asistio") estadisticas.asistio++;
                if (e.estado === "no_asistio") estadisticas.falto++;
            });

            estadisticas.porcentajeAsistencia =
                estadisticas.total === 0
                    ? 0
                    : Math.round((estadisticas.asistio / estadisticas.total) * 100);

            setEstadisticas(estadisticas);
            // console.log("37", estadisticas);
            // setFormulario({ ...Formulario, estadisticas: estadisticas, hoy: dia, clase: clase })

            const tbl = new TableConfig()
            tbl.addCol("_id", "id", true, false)
            tbl.addCol("alumno.nombre", "Alumno", true, false, {
                type: 'text',
                body: (rowData) => (
                    <div>
                        <p className="m-0">{rowData?.alumno?.nombre + " " + rowData?.alumno?.apellidos}</p>
                        <p className="m-0 fz-10">{rowData?.alumno?.email}</p>
                    </div>
                )
            }, false, "max-content")
            tbl.addCol("clase.nombre", "Clase", true, false)
            tbl.addCol("fecha", "Fecha", true, false, {
                type: 'text',
                body: (rowData) => (
                    <div>
                        <p className="m-0">{rowData?.fecha.split("T")[0]}</p>
                    </div>
                )
            }, false, "max-content")
            tbl.addCol("estado", "Estado", true, false, {
                type: 'text',
                body: (rowData) => (
                    <Tag severity={rowData.estado == "asistio" ? "success" : rowData.estado == "Pendiente" ? "warning" : "danger"} value={PrimeraMayuscula(rowData.estado)} rounded className="mt-2"></Tag>
                )
            }, false, "max-content")

            tbl.addData(listaAsistencia?.data);
            tbl.addDataKey('asistenciaTabla')
            setTabla(tbl)
        } catch (error) {
            console.log(error);
        }
        // console.log("23", idClase, fecha);
    }
    const templateValores = ({ icon = "", color = "", titulo = "", des = "" } = {}) => {
        return (
            <div className="card-efect card text-start br-15 ps-4 pe-4 pt-1 pb-1">
                <div className="row">
                    <div className="col col-2 d-flex align-items-center">
                        {/* {item.alumno.avatar} */}
                        <Avatar icon={icon} className={'icon-admin p-3 ' + color} shape="circle" />
                    </div>
                    <div className="col col-9 text-center">
                        <div className="m-0 fz-15 text-gray ms-2">{titulo}</div>
                        <div className="m-0 fz-12 text-gray-2 ms-2">
                            <strong className={"fz-30 " + color}>
                                <span>{des}</span>
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const accionesGlobal = (tipo) => {
        switch (tipo) {
            case "faltaGrupal":
                acciones({ tipo: "faltaGrupal", mensaje: "Asistencia grupal actualizada" })
                break;
            case "asistenciaGrupal":
                acciones({ tipo: "grupal", mensaje: "Asistencia grupal actualizada" })
                break;
            case "asistenciaIndividual":
                acciones({ tipo: "asistencia", mensaje: "Asistencia actualizada" })
                break;
            case "faltaIndividual":
                acciones({ tipo: "falta", mensaje: "Falta registrada" })
                break;
            default:
                break;
        }
    }
    useEffect(() => {
        if (!Formulario.hoy || !Formulario.clase) return;
        console.log("104");
        crearTabla(Formulario.hoy, Formulario.clase);
    }, [Formulario.hoy, Formulario.clase]);
    useEffect(() => {
        // if (Seleccionados.length == 0) return;
        if (Tabla && Tabla.getConfig().selectedRows.length > 0) {
            // console.log("113", Tabla.getConfig().selectedRows.estado);
            setSeleccionados(Tabla.getConfig().selectedRows)
        } else {
            setSeleccionados([])
        }

    }, [Tabla]);

    const init = async () => {
        try {
            const listaClases = await servicesPole.clases.consultarClases();
            const claseDefault = listaClases?.data?.[0]?._id;
            // const fecha = obtenerFecha({ date: new Date(), separador: "-" }).formato;
            fNuevaClase[1].options = listaClases.data;
            setFormulario({
                hoy: new Date(),
                clase: claseDefault
            });
            // console.log("194", claseDefault);
            crearTabla(new Date(), claseDefault);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        init();
    }, []);
    return (
        <div>
            <div className="row">
                <div className="col col-8 col-md-8">
                    <TituloAdmin titulo={"Control de asistencia"} descripcion={"Registra y monitorea la asistencia de estudiantes"} />
                </div>
                <div className="col col-4 col-md-4 text-end d-flex align-items-center">
                    <div className="ms-auto">
                        <CreadorFormularios
                            key="formulario-calendario"
                            campos={fNuevaClase}
                            datos={Formulario}
                            control={setFormulario}
                        />
                    </div>
                </div>
                <div className="col col-12 col-md-3">
                    {templateValores({ icon: "pi pi-users", color: "text-primary", titulo: "Total", des: Estadisticas?.total })}
                </div>
                <div className="col col-12 col-md-3">
                    {templateValores({ icon: "pi pi-check-circle", color: "text-success", titulo: "Asistieron", des: Estadisticas?.asistio })}
                </div>
                <div className="col col-12 col-md-3">
                    {templateValores({ icon: "pi pi-calendar-times", color: "text-danger", titulo: "No asistieron", des: Estadisticas?.falto })}
                </div>
                <div className="col col-12 col-md-3">
                    {templateValores({ icon: "pi pi-clock", color: "text-dual", titulo: "Tasa de asistencia", des: Estadisticas?.porcentajeAsistencia + "%" })}
                </div>
            </div>
            {Seleccionados?.length == 1 &&
                <div className="bg-dual br-15 text-end pe-4">
                    {Tabla.getConfig().selectedRows?.[0]?.estado == "no_asistio" ?
                        <Button icon="pi pi-calendar" rounded text raised severity="success" aria-label="Search" tooltip="Marcar Asistencia" className="ms-2 bg-white btn-circulo mb-1 mt-1" tooltipOptions={{ position: "left" }} onClick={() => accionesGlobal("asistenciaIndividual")} /> :
                        <Button icon="pi pi-calendar-times" rounded text raised severity="danger" aria-label="Search" tooltip="Eliminar Asistencia" className="ms-2 bg-white btn-circulo mb-1 mt-1" tooltipOptions={{ position: "left" }} onClick={() => accionesGlobal("faltaIndividual")} />
                    }
                </div>
            }
            {Tabla == null ?
                <SinContenido icon={"pi pi-calendar"} titulo={"No hay asistencias"} descripcion={"No hay información en de asistencias"} /> :
                <TablaPersonaliza
                    datos={Tabla}
                    control={setTabla}
                    recarga={() => crearTabla(Formulario.hoy, Formulario.clase)}
                />
            }

        </div>
    )
}