import { Button } from "primereact/button";
import TituloAdmin from "../tituloAdmin";
import SinContenido from "../sinContendio";
import { useEffect, useState } from "react";
import TableConfig from "@/js/clases/POOTabla";
import TablaPersonaliza from "../TablaPersonaliza";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";
import Modal from "../modal";
import CreadorFormularios from "../CreadorFormularios";
import { servicesPole } from "@/service/api";
import { useGlobalStore } from "@/stores/itemStore";
import { cumplioEstructura, obtenerFecha, validarEstructura, validarFormulario } from "@/js/scrips";

const estudiantes = [
    { id: 0, nombre: "Brenda Paola Godoy Rosas", nacimiento: "18-11-1994", correo: "paolaginzalez@gmail.com", telefono: "5630728357", nivel: "Intermedio", clases: "0" }
]
const fRegistro = [
    { id: "nombre", type: "text", title: "Nombre(s) *", classDiv: "col col-12", placeholder: "Tu nombre", required: true, error: "El nombre es requerido" },
    { id: "apellidos", type: "text", title: "Apellidos *", classDiv: "col col-12", placeholder: "Tu apellido", required: true, error: "El apellido es requerido" },
    { id: "email", type: "text", title: "Email *", classDiv: "col col-12 col-md-6", placeholder: "tu@email.com", required: true, error: "El email es requerido" },
    { id: "telefono", type: "text", title: "Telefono *", classDiv: "col col-12 col-md-6", placeholder: "5512345678", required: true, error: "El telefono es requerido" },
    { id: "fechaNacimiento", type: "calendar", title: "Fecha de nacimiento *", classDiv: "col col-12 col-md-12", placeholder: "5512345678" },
]
const fRegistroMedico = [
    { id: "condiciones", type: "textArea", title: "Condiciones médicas", classDiv: "col col-12 col-md-6", placeholder: "Diabetes, hipertencion, etc" },
    { id: "alerjias", type: "textArea", title: "Alergias", classDiv: "col col-12 col-md-6", placeholder: "Polen, Polvo, etc" },
    { id: "lesiones", type: "textArea", title: "Lesiones previas", classDiv: "col col-12 col-md-6", placeholder: "Pierna, Brazo, etc" },
    { id: "medicamento", type: "textArea", title: "Medicamento", classDiv: "col col-12 col-md-6", placeholder: "inhalador, insulina" },
    { id: "contactoEmergencia", type: "text", title: "Contacto de emergencia *", classDiv: "col col-12 col-md-12", placeholder: "5512345678", required: true, error: "El contacto de emergenca es requerido" },
    { id: "notas", type: "textArea", title: "Notas adicionales", classDiv: "col col-12", placeholder: "Información adicional" },
]
const crearEstructura = {
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
    password: "1234"
}
export default function Estudiantes(params) {
    const [Tabla, setTabla] = useState(null)
    const [Formulario, setFormulario] = useState(crearEstructura)
    const { addData } = useGlobalStore();
    const [ModalC, setModalC] = useState({ activar: false, header: "Nuevo Estudiante", style: { width: "50%", margin: "auto" }, class: "bg-admin modal-container position-relative" })

    const accionesServicio = async (tipo, datos) => {
        let res = {}
        switch (tipo) {
            case "eliminar":
                res = await servicesPole.dashboard.eliminarUsuarios(Formulario._id)
                break;
            case "activar":
                datos.activo = true
                res = await servicesPole.dashboard.editarUsuarios(datos, Formulario._id)
                break;
            case "desactivar":
                datos.activo = false
                res = await servicesPole.dashboard.editarUsuarios(datos, Formulario._id)
                break;
            case "editar":
                res = await servicesPole.dashboard.editarUsuarios(datos, Formulario._id)
                break;
            case "crear":
                res = await servicesPole.dashboard.crearUsuarios(datos)
                break;

            default:
                break;
        }
        return res
    }
    const acciones = async ({ tipo = "crear", template = crearEstructura, formulario = fRegistro.concat(fRegistroMedico), mensaje = "Registrando alumno" } = {}) => {
        addData("load", { activo: true, mensaje: "Cargando..." })
        let res = validarEstructura(template, Formulario)
        let validacionFormulario = validarFormulario(formulario, Formulario)
        // console.log("68", res, validacionFormulario, tipo);
        if (cumplioEstructura(res) && validacionFormulario.length == 0) {
            try {
                await accionesServicio(tipo, res.value)
                addData("notificacion", { severity: 'success', summary: 'Acción completada', detail: mensaje, life: 3000 })
                setModalC({ ...ModalC, activar: false })
                Tabla.getConfig().selectedRows.length = 0
                crearTabla()
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
    const crearTabla = async () => {
        addData("load", { activo: true, mensaje: "Cargando..." })
        let alumnos = await servicesPole.dashboard.ObtenerUsuarios({ roles: "alumno" })
        // console.log("90 Alumnos", alumnos);

        const tbl = new TableConfig()
        tbl.addCol("_id", "ID", true, false)
        tbl.addCol("estudiante", "Estudiante", true, false, {
            type: 'text',
            body: (rowData) => (
                <div className="text-start row" key={"estudiante"}>
                    <div className="col col-2">
                        <Avatar label="B" className='icon-admin' shape="circle" />
                    </div>
                    <div className="col col-10 text-start">
                        <p className="m-0 fz-15">{rowData.nombre}</p>
                        <p className="m-0 fz-12 text-gray-2">{rowData.nacimiento}</p>
                    </div>
                </div>
            ),
        })
        tbl.addCol("contacto", "Correo", true, false, {
            type: 'text',
            body: (rowData) => (
                <div className="text-start" key={"contacto"}>
                    <p className="m-0"><span className="pi pi-envelope me-2"></span>{rowData.email}</p>
                </div>
            )
        })
        tbl.addCol("contacto", "Telefono", true, false, {
            type: 'text',
            body: (rowData) => (
                <div className="text-start" key={"contacto"}>
                    <p className="m-0"><span className="pi pi-phone me-2 fz-12"></span>{rowData.telefono}</p>
                </div>
            )
        })
        tbl.addCol("activo", "Estatus", true, false, {
            type: 'text',
            body: (rowData) => (
                <div className="text-start" key={"nivel"}>
                    <Tag severity={rowData.activo ? "success" : "danger"} value={rowData.activo ? "Activo" : "Inactivo"} rounded className="mt-2"></Tag>
                </div>
            )
        }, false, "max-content")
        tbl.accionRecarga(() => recargarTodo())
        tbl.addData(alumnos.data || []);
        tbl.addDataKey('alumnosTabla')
        // console.log(tbl);
        setTabla(tbl)
        addData("load", { activo: false, mensaje: "Cargando..." })
    }
    useEffect(() => {
        if (Tabla && Tabla.getConfig().selectedRows.length == 1) {
            console.log('Selected rows:', Tabla.getConfig().selectedRows);
            let obj = Tabla.getConfig().selectedRows[0]
            if (typeof obj.fechaNacimiento == "string") {
                obj.fechaNacimiento = obtenerFecha({ date: obj?.fechaNacimiento?.split("T")[0], separador: "-", format: true }).format
            }
            obj.seleccionado = true
            setFormulario(obj)
        } else {
            setFormulario(crearEstructura)
        }
    }, [Tabla]);
    useEffect(() => {
        crearTabla()
    }, [])
    return (
        <div>
            <Modal data={ModalC} control={setModalC} >
                <div className="mb-5">
                    <p><span className="pi pi-user me-2"></span>Información Persona</p>
                    <CreadorFormularios
                        key="formulario-registro"
                        campos={fRegistro}
                        datos={Formulario}
                        control={setFormulario}
                    />
                    <p><span className="pi pi-document me-2"></span>Historial Médico</p>
                    <CreadorFormularios
                        key="formulario-registro-medico"
                        campos={fRegistroMedico}
                        datos={Formulario}
                        control={setFormulario}
                    />
                </div>
                <div className="acciones-modal d-flex mt-3 text-end">
                    <Button label="Cancelar" className="br-15 me-2 ms-auto" severity="secondary" text raised onClick={() => setModalC({ ...ModalC, activar: false })} />
                    <Button label={Formulario.seleccionado ? "Editar" : "Registrar"} className="btn btn-dual br-15" onClick={() => Formulario.seleccionado ? acciones({ tipo: "editar", mensaje: "Alumno actualizado" }) : acciones()} />
                </div>
            </Modal>
            <div className="row">
                <div className="col col-6">
                    <TituloAdmin titulo={"Estudiantes"} descripcion={"Gestiona los estudiantes del estudio"} />
                </div>
                <div className="col col-6 text-end d-flex align-items-center">
                    {Formulario.seleccionado == true &&
                        <div className="d-flex">
                            <Button icon="pi pi-pen-to-square" label="Editar" className="ms-2 btn btn-info br-15" onClick={() => setModalC({ ...ModalC, activar: true })} />
                            {Formulario.activo ?
                                <Button icon="pi pi-unlock" label="Desactivar" className="ms-2 btn btn-warning br-15" onClick={() => acciones({ tipo: "desactivar", mensaje: "Usuario desactivado" })} /> :
                                <Button icon="pi pi-lock" label="Activar" className="ms-2 btn btn-success br-15" onClick={() => acciones({ tipo: "activar", mensaje: "Usuario activado" })} />
                            }
                            <Button icon="pi pi-trash" label="Eliminar" className="ms-2 me-2 btn btn-danger br-15" onClick={() => acciones({ tipo:"eliminar", mensaje:"Alumno eliminado" })} />
                        </div>
                    }
                    <Button icon="pi pi-plus" label="Nuevo estudiante" className="ms-auto btn-dual br-15" onClick={() => setModalC({ ...ModalC, activar: true })} />
                </div>
            </div>
            <div className="card br-15 mt-3">
                {Tabla?.tableData?.length == 0 ?
                    <SinContenido icon={"pi pi-user"} titulo={"No hay estudiantes"} descripcion={"Comienza agregando tu primer estudiante"} btnLabel={"Agregar estudiante"} accion={() => setModalC({ ...ModalC, activar: true })} /> :
                    <TablaPersonaliza
                        datos={Tabla}
                        control={setTabla}
                    />
                }

            </div>
        </div>
    )
}