import { Button } from "primereact/button";
import TituloAdmin from "../tituloAdmin";
import { useEffect, useRef, useState } from "react";
import CreadorFormularios from "../CreadorFormularios";
import global from "@/js/jsons/global";
import { cumplioEstructura, logE, obtenerFecha, obtenerIdsArreglo, validarEstructura, validarFormulario } from "@/js/scrips";
import SinContenido from "../sinContendio";
import { Image } from "primereact/image";
import { Chip } from "primereact/chip";
import Modal from "../modal";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { useGlobalStore } from "@/stores/itemStore";
import { CargarArchivo } from "../CargaArchivo";
import { servicesPole } from "@/service/api";
const fNuevoInstructor = [
    { id: "nombre", type: "text", title: "Nombre(s) *", classDiv: "col col-12", placeholder: "Tu nombre", required: true, error: "El nombre es requerido" },
    { id: "apellidos", type: "text", title: "Apellidos *", classDiv: "col col-12", placeholder: "Tu apellido", required: true, error: "El apellido es requerido" },
    { id: "email", type: "text", title: "Correo *", classDiv: "col col-12 col-md-6", placeholder: "correo@dominio.com", required: true, error: "El Correo es requerido" },
    { id: "telefono", type: "text", title: "Telefono *", classDiv: "col col-12 col-md-6", placeholder: "5525813583", required: true, error: "El Telefono es requerido" },
    { id: "fechaNacimiento", type: "calendar", title: "Fecha de nacimiento *", classDiv: "col col-12 col-md-12" },
    { id: "notas", type: "textArea", title: "Descripción *", classDiv: "col col-12", placeholder: "Descripción...", required: true, error: "La Descripcion es requerida" },
]
const ECrearMaestro = { ...global.creadorUsuarios, actualizarI: false }
export default function Instructores() {
    const [Maestros, setMaestros] = useState(null)
    const [Formulario, setFormulario] = useState(ECrearMaestro)
    const [ModalC, setModalC] = useState({ activar: false, header: "Nuevo instructor", style: { width: "50%", margin: "auto" }, class: "bg-admin modal-container" })
    const { addData } = useGlobalStore();
    const [Archivo, setArchivo] = useState([]);
    const cargaArchivoRef = useRef(null);
    var dataG = {}

    const accionesServicio = async (tipo, datos) => {
        let res = {}
        var arc = new FormData()
        switch (tipo) {
            case "eliminar":
                // console.log("37", dataG);
                res = await servicesPole.dashboard.eliminarUsuarios(dataG._id)
                break;
            case "editar":
                if (Archivo.length > 0) {
                    Object.entries(datos).forEach(([key, value]) => {
                        arc.append(key, value);
                    });
                    arc.append("avatar", Archivo[0])
                    res = await servicesPole.dashboard.editarUsuarios(arc, Formulario._id)
                } else {
                    res = await servicesPole.dashboard.editarUsuarios(datos, Formulario._id)
                    // console.log("36", res);
                }
                break;
            case "crear":
                datos.rol = "maestro"
                // datos.especialidades = obtenerIdsArreglo(datos.especialidades, "id")
                if (Archivo.length > 0) {
                    Object.entries(datos).forEach(([key, value]) => {
                        arc.append(key, value);
                    });
                    arc.append("avatar", Archivo[0])
                    res = await servicesPole.dashboard.crearUsuarios(arc)
                }
                break;
            default:
                break;
        }
        return res
    }
    const acciones = async ({ tipo = "crear", template = ECrearMaestro, formulario = fNuevoInstructor, mensaje = "" } = {}) => {
        addData("load", { activo: true, mensaje: "Cargando..." })
        let res = validarEstructura(template, Formulario)
        let validacionFormulario = validarFormulario(formulario, Formulario)
        // console.log("68", res, validacionFormulario);
        if (cumplioEstructura(res) && validacionFormulario.length == 0) {
            try {
                await accionesServicio(tipo, res.value)
                addData("load", { activo: false, mensaje: "Cargando..." })
                addData("notificacion", { severity: 'success', summary: 'Acción completada', detail: mensaje, life: 3000 })
                setModalC({ ...ModalC, activar: false, tipo: "crear" })
                setFormulario(template)
                setArchivo([])
                consultarMaestros()
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
    const eliminarInstructor = (e, data) => {
        // console.log(data);
        // setFormulario({ ...ModalC, data: data })
        dataG = data
        confirm1(e)
    }
    const templateCardMaestro = (data) => {
        // console.log("85:", data);
        return (
            <div className="card card-efect br-15 overflow-hidden">
                <div className="m-auto" style={{ height: "150px", width: "150px", overflow: "hidden" }}>
                    <Image src={data?.avatar} width="100%" height="100%" />
                </div>
                <div className="p-4">
                    <div className="row">
                        <div className="col col-8">
                            <strong>{data?.nombre} {data?.apellidos}</strong>
                        </div>
                        <div className="col col-4">
                            <ConfirmPopup />
                            <div className="mt-2 text-end" >
                                <span onClick={() => editarMaestro(data)} className="pi pi-pen-to-square pointer me-2 text-success me-2"></span>
                                <span onClick={(e) => { eliminarInstructor(e, data) }} className="pi pi-trash text-danger pointer"></span>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray fz-12"><span className="pi pi-envelope me-2"></span>{data?.email}</p>
                    <p className="text-gray fz-12"><span className="pi pi-phone me-2"></span>{data?.telefono}</p>
                    <div>
                        {data?.especialidades?.map((e, i) => {
                            return (
                                <Chip className="bg-dual-claro fz-12 me-2 mt-2" label={e} key={"tags" + i} />
                            )
                        })}
                    </div>
                    <p className="mt-2">{data?.notas}</p>
                </div>
            </div>
        )
    }
    const marcarClases = (e) => {
        setFormulario((prev) => {
            const clases = prev.especialidades || [];

            const existe = clases.includes(e.id);

            const nuevasClases = existe
                ? clases.filter(item => item !== e.id) // ❌ quitar
                : [...clases, e.id]; // ✅ agregar
            // console.log("128", nuevasClases);
            return {
                ...prev,
                especialidades: nuevasClases
            };
        });
    };
    const confirm1 = (event) => {
        // console.log("142", Formulario);

        confirmPopup({
            target: event.currentTarget,
            message: 'Realmente deseas elimiar el instructor?',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept,
            reject
        });
    };
    const accept = () => {
        // console.log("eliminar", ModalC);
        acciones({ tipo: "eliminar", mensaje: "Instructor eliminado", formulario: [], template: ECrearMaestro })
    };
    const reject = () => {
        console.log("cancelar");
    };
    const crearEditar = (tipo) => {
        // console.log("133", Formulario, ECrearMaestro);
        acciones({ tipo: tipo, mensaje: tipo == "editar" ? "Instructor actualizado" : "Instructor creado", formulario: fNuevoInstructor, template: ECrearMaestro })
        // acciones({ tipo: "editar", mensaje: "Alumno actualizado" })
    }
    const consultarMaestros = async () => {
        let maestro = await servicesPole.dashboard.ObtenerUsuarios({ roles: "maestro" })
        // console.log(maestro.data);
        setMaestros(maestro.data)
    }
    const editarMaestro = (e) => {
        let obj = e
        console.log("162", typeof obj.fechaNacimiento);
        obj.fechaNacimiento = typeof obj.fechaNacimiento == "string" ? obtenerFecha({ date: obj?.fechaNacimiento?.split("T")[0], format: true, separador: "-" }).format : obj.fechaNacimiento
        obj.actualizarI = true
        setFormulario(obj)
        setModalC({ ...ModalC, activar: true, tipo: "editar", header: "Editar instructor" })
    }
    useEffect(() => {
        consultarMaestros()
        // console.log(ECrearMaestro);
    }, [])
    return (
        <div>
            <Modal data={ModalC} control={setModalC}>
                {Formulario?.actualizarI ?
                    <div className="m-auto mb-4" style={{ height: "200px", width: "200px" }}>
                        <Image src={Formulario?.avatar} width="100%" height="100%" />
                        <Button label="Actulizar imagen" className="br-15 me-2 ms-auto" severity="secondary" text raised onClick={() => setFormulario({ ...Formulario, actualizarI: !Formulario.actualizarI })} />
                    </div> :
                    <div className="m-auto mb-4 d-grid">
                        <CargarArchivo ref={cargaArchivoRef} datos={Archivo} control={setArchivo} />
                        <small>Formatos validos: png, jpg, webp</small>
                        {ModalC.tipo == "editar" &&
                            <Button label="Mantener imagen" className="br-15 m-auto" severity="secondary" text raised onClick={() => setFormulario({ ...Formulario, actualizarI: !Formulario.actualizarI })} />
                        }

                    </div>
                }
                <CreadorFormularios
                    key="formulario-instructores"
                    campos={fNuevoInstructor}
                    datos={Formulario}
                    control={setFormulario}
                />
                <h5>Especialidades</h5>
                <div className="mb-5">
                    {global.clases.map((e, i) => {
                        return (
                            <Chip label={e.nombre} key={"clases" + i} className={`m-2 fz-12 pointer ${Formulario?.especialidades?.includes(e.id) ? "clase-activa" : ""}`} onClick={() => marcarClases(e)} />
                        )
                    })}
                </div>
                <div className="acciones-modal d-flex mt-3 text-end">
                    <Button label="Cancelar" className="br-15 me-2 ms-auto" severity="secondary" text raised onClick={() => setModalC({ ...ModalC, activar: false, tipo: "crear" })} />
                    <Button label={ModalC.tipo == "editar" ? "Editar" : "Registrar"} className="btn btn-dual br-15" onClick={() => crearEditar(ModalC.tipo)} />
                </div>
            </Modal>
            <div className="row">
                <div className="col col-12 col-md-6">
                    <TituloAdmin titulo={"Instructores"} descripcion={"Gestiona el equipo de instructores"} />
                </div>
                <div className="col col-12 col-md-6 text-end d-flex align-items-center">
                    <div className="ms-auto">
                        <Button icon="pi pi-plus" label="Nuevo instructor" className="ms-auto btn-dual br-15 me-3" onClick={() => { setModalC({ ...ModalC, activar: true, tipo: "crear" }), setFormulario(ECrearMaestro) }} />
                    </div>
                </div>
            </div>
            <div className="row">
                {Maestros?.length == 0 ?
                    <div className="col col-12">
                        <SinContenido icon={"pi pi-user"} titulo={"No hay instructores"} descripcion={"Agregando tu primer instructor"} btnLabel={"Nuevo instructor"} accion={() => setModalC({ ...ModalC, activar: true })} />
                    </div> :
                    Maestros?.map((e, i) => {
                        return (
                            <div className="col col-12 col-md-4" key={"maestros" + i}>
                                {templateCardMaestro(e)}
                            </div>
                        )
                    })}
            </div>

        </div>
    )
}