import { Button } from "primereact/button";
import TituloAdmin from "../tituloAdmin";
import { useEffect, useRef, useState } from "react";
import CreadorFormularios from "../CreadorFormularios";
import global from "@/js/jsons/global";
import { cumplioEstructura, logE, obtenerFecha, PrimeraMayuscula, validarEstructura, validarFormulario } from "@/js/scrips";
import { CargarArchivo } from "../CargaArchivo";
import { useGlobalStore } from "@/stores/itemStore";
import { servicesPole } from "@/service/api";
import { Avatar } from "primereact/avatar";
import Modal from "../modal";
const fUsuario = [
    { id: "nombre", type: "text", title: "Nombre", classDiv: "col col-6", placeholder: "Nombre", required: true, error: "EL campo Nombre es requerido" },
    { id: "apellidos", type: "text", title: "Apellidos", classDiv: "col col-6", placeholder: "Apellidos", required: true, error: "EL campo Apellidos es requerido" },
    { id: "email", type: "text", title: "Email", classDiv: "col col-6", placeholder: "Email", required: true, error: "EL campo Email es requerido" },
    { id: "telefono", type: "text", title: "Telefono", classDiv: "col col-6", placeholder: "Telefono", required: true, error: "EL campo Telefono es requerido" },
    { id: "fechaNacimiento", type: "calendar", title: "Fecha de nacimiento", classDiv: "col col-6", placeholder: "Fecha de nacimiento" },
]
const fPass = [
    { id: "password", type: "pass", title: "Actualizar Contraseña", classDiv: "col col-12", placeholder: "*****" },
]
const templateUsuario = global.creadorUsuarios
const modalDefecto = { activar: false, header: "Cargar imagen de usuario", style: { width: "50%", margin: "auto" }, class: "bg-admin modal-container" }
export default function Configuracion() {
    // const [Tab, setTab] = useState({ labels: ["Horario semanal", "Lista de clases"], index: 0 });
    const [ModalC, setModalC] = useState(modalDefecto)
    const [Formulario, setFormulario] = useState(templateUsuario)
    const [User, setUser] = useState(null)
    const { data, addData } = useGlobalStore();
    const [Archivo, setArchivo] = useState([]);
    const cargaArchivoRef = useRef(null);
    const accionesServicio = async (tipo, datos) => {
        let res = {}
        var arc = new FormData()
        switch (tipo) {
            case "actualizarInfo":
                datos.fechaNacimiento = obtenerFecha({ date: Formulario.fechaNacimiento, separador: "-" }).formato
                datos.password = Formulario.password
                console.log("32", datos);
                if (Archivo.length > 0) {
                    Object.entries(datos).forEach(([key, value]) => {
                        arc.append(key, value);
                    });
                    arc.append("avatar", Archivo[0])
                    res = await servicesPole.dashboard.editarUsuarios(arc, Formulario._id)
                } else {
                    res = await servicesPole.dashboard.editarUsuarios(datos, Formulario._id)
                }
                break;

            default:
                break;
        }
        return res
    }
    const acciones = async ({ tipo = "crear", template = templateUsuario, formulario = [], mensaje = "" } = {}) => {
        addData("load", { activo: true, mensaje: "Cargando..." })
        let res = validarEstructura(template, Formulario)
        let validacionFormulario = validarFormulario(formulario, Formulario)
        // console.log("45", res, validacionFormulario, Formulario);
        if (cumplioEstructura(res) && validacionFormulario.length == 0) {
            try {
                await accionesServicio(tipo, res.value)
                addData("load", { activo: false, mensaje: "Cargando..." })
                addData("notificacion", { severity: 'success', summary: 'Acción completada', detail: mensaje, life: 3000 })
                consultarData()
                // setModalC(modalDefecto)
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
            case "actualizarInfo":
                delete templateUsuario.password
                // console.log("67", templateUsuario);
                acciones({ tipo: "actualizarInfo", mensaje: "Información actualizada", template: templateUsuario })
                break;
            default:
                break;
        }
    }
    const consultarData = async () => {
        addData("load", { activo: true, mensaje: "Cargando..." })
        try {
            let infoUsuario = await servicesPole.dashboard.ObtenerUnUsuario(data.sesion._id)
            delete infoUsuario.data.password
            infoUsuario.data.condiciones = infoUsuario.data.condiciones == undefined ? "" : infoUsuario.data.condiciones
            infoUsuario.data.alerjias = infoUsuario.data.alerjias == undefined ? "" : infoUsuario.data.alerjias
            infoUsuario.data.lesiones = infoUsuario.data.lesiones == undefined ? "" : infoUsuario.data.lesiones
            infoUsuario.data.medicamento = infoUsuario.data.medicamento == undefined ? "" : infoUsuario.data.medicamento
            infoUsuario.data.contactoEmergencia = infoUsuario.data.contactoEmergencia == undefined ? "" : infoUsuario.data.contactoEmergencia
            infoUsuario.data.notas = infoUsuario.data.notas == undefined ? "" : infoUsuario.data.notas
            infoUsuario.data.fechaNacimiento = typeof infoUsuario.data.fechaNacimiento == "string" ? obtenerFecha({ date: infoUsuario.data.fechaNacimiento.split("T")[0], separador: "-", format: true }).format : obtenerFecha({ date: infoUsuario.data.fechaNacimiento, separador: "-", format: true }).format
            // console.log("27", infoUsuario.data);
            setFormulario(infoUsuario.data)
            setUser(infoUsuario.data)
            addData("load", { activo: false, mensaje: "Cargando..." })
        } catch (error) {
            console.log("86", error);
            addData("load", { activo: false, mensaje: "Cargando..." })
        }
    }
    const templateValores = ({ icon = "", color = "", titulo = "", des = "" } = {}) => {
        return (
            <div className="card-efect card text-start br-15 ps-4 pe-4 pt-1 pb-1">
                <div className="row">
                    <div className="col col-2 d-flex align-items-center">
                        {
                            Archivo.length > 0 ? (
                                <img
                                    src={URL.createObjectURL(Archivo[0])}
                                    alt="avatar"
                                    className="icon-admin rounded-circle"
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        objectFit: "cover"
                                    }}
                                />
                            ) : User?.avatar ? (
                                <img
                                    src={User.avatar}
                                    alt="avatar"
                                    className="icon-admin rounded-circle"
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        objectFit: "cover"
                                    }}
                                />
                            ) : (
                                <Avatar
                                    icon={icon}
                                    className={'icon-admin p-3 ' + color}
                                    shape="circle"
                                />
                            )
                        }
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
    useEffect(() => {
        if (Archivo.length > 0) {
            // console.log("122", Archivo);
            setModalC({ ...ModalC, activar: false })
        }
    }, [Archivo])
    useEffect(() => {
        consultarData()
    }, [])
    return (
        <div>
            <Modal data={ModalC} control={setModalC}>
                <CargarArchivo ref={cargaArchivoRef} datos={Archivo} control={setArchivo} />
                <small>Formatos validos: png, jpg, webp</small>
            </Modal>
            <div className="row">
                <div className="col col-10">
                    <TituloAdmin titulo={"Configuración"} descripcion={"Administra tu cuenta y preferencias"} />
                </div>
                <div className="col col-2 text-end d-flex align-items-center">
                </div>
                <div className="col col-12 col-md-8">
                    <div className="card p-4 br-15">
                        <div className="pointer" onClick={() => setModalC({ ...ModalC, activar: true })}>
                            {templateValores({ icon: "pi pi-user", color: "text-success", titulo: User?.nombre + " " + User?.apellidos, des: PrimeraMayuscula(User?.rol) })}
                        </div>
                        <CreadorFormularios
                            key="formulario-admin"
                            campos={fUsuario}
                            datos={Formulario}
                            control={setFormulario}
                        />
                        <div className="fz-20"><strong><span className="pi pi-shield"></span> Seguridad</strong></div>
                        <CreadorFormularios
                            key="formulario-contraseña"
                            campos={fPass}
                            datos={Formulario}
                            control={setFormulario}
                        />
                        <Button label={"Actualizar datos"} className="btn btn-dual br-15 me-2" onClick={() => accionesGlobal("actualizarInfo")} />
                    </div>
                </div>
                <div className="col col-12 col-md-4">
                    <div className="card br-15 p-3">
                        <div className="fz-20"><strong><span className="pi pi-info-circle"></span> Acerca de</strong></div>
                        <p>Acerca de nuestro Sistema de Gestión</p>

                        <p>Nuestro sistema de gestión ha sido diseñado para optimizar y simplificar los procesos operativos de las organizaciones, permitiendo un control eficiente, seguro y centralizado de la información. Su enfoque integral facilita la administración de recursos, el seguimiento de actividades y la toma de decisiones basada en datos en tiempo real.</p>


                    </div>
                </div>
            </div>

        </div>
    )
}