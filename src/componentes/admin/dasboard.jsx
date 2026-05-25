import { Avatar } from "primereact/avatar";
import { Message } from "primereact/message";
import { Tag } from "primereact/tag";
import TituloAdmin from "../tituloAdmin";
import SinContenido from "../sinContendio";
import TablaPersonaliza from "../TablaPersonaliza";
import { useEffect, useState } from "react";
import global from "@/js/jsons/global";
import TableConfig from "@/js/clases/POOTabla";
import { Button } from "primereact/button";
import { servicesPole } from "@/service/api";
import { useGlobalStore } from "@/stores/itemStore";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { generarRandom } from "@/js/scrips";

const miAdminJson = {
    nombre: "Héctor Eduardo González Luna",
    email: "lyon15189@gmail.com",
    password: "123456",
    rol: "admin",
    telefono: "1234567890",
    direccion: "dir1",
    fechaNacimiento: new Date()
}
const crearAdminJson = {
    nombre: "Admin",
    apellidos: "Apellidos",
    email: "admin" + generarRandom(4) + "@test.com",
    password: "123456",
    rol: "admin",
    telefono: "1234567890",
    direccion: "dir1",
    fechaNacimiento: "2026-04-01"
}
export default function Dashboar(params) {
    const [Tabla, setTabla] = useState(null)
    const { addData, data } = useGlobalStore();
    const [Dash, setDash] = useState(null)

    const clase = () => (
        <div className="w-100">
            <p className="m-0">Twerk</p>
            <p className="m-0 fz-12" style={{ color: "rgb(194 65 12 / var(--tw-text-opacity, 1))" }}>Lunes • 10:00</p>
        </div>
    )
    const crearTabla = async () => {
        addData("load", { activo: true, mensaje: "Cargando..." })
        try {
            let listadoUsuariosServ = await servicesPole.dashboard.ObtenerUsuarios()
            let dataDashboard = await servicesPole.dashboard.consultarDashboard()
            setDash(dataDashboard.data)
            // console.log("50", dataDashboard.data);
            const tbl = new TableConfig()
            tbl.addCol("_id", "ID", true, false)
            tbl.addCol("nombre", "Nombre", true, false)
            tbl.addCol("rol", "Rol", true, false)
            tbl.addCol("telefono", "Telefono", true, false)
            tbl.addCol("email", "Correo", true, false)
            tbl.addCol("direccion", "Dirección", true, false)
            tbl.addCol("activo", "Estado", true, false, {
                type: 'text',
                body: (rowData) => (
                    <div className="text-start" >
                        <Tag severity={rowData.activo ? "success" : "danger"} value={rowData.activo ? "Activo" : "Inactivo"} rounded className="mt-2"></Tag>
                    </div>
                )
            }, false, "max-content")
            tbl.addData(listadoUsuariosServ.data || []);
            tbl.addDataKey('adminsTabla')
            setTabla(tbl)
            addData("load", { activo: false, mensaje: "Cargando..." })
        } catch (error) {
            console.log(error);
            addData("load", { activo: false, mensaje: "Cargando..." })

        }
    }
    const crearAdmin = async () => {
        try {
            // let obj = miAdminJson
            let obj = crearAdminJson
            obj.email = "admin" + generarRandom(4) + "@test.com",
                await servicesPole.dashboard.crearUsuarios(obj)
            addData("alert", { severity: "success", summary: "Acción exitosa", detail: "El administrador fue creado", life: 3000 })
            crearTabla()
        } catch (error) {
            addData("alert", { severity: "error", summary: "Hubo un error", detail: error.response.data.message, life: 3000 })
        }
    }
    const serviciosAccion = async ({ tipo = "" } = {}) => {
        let respuesta = {}
        let data = Tabla.getConfig().selectedRows[0]
        switch (tipo) {
            case "eliminar":
                // console.log("78");
                respuesta = await servicesPole.dashboard.eliminarUsuarios(data._id)
                break;
            case "desactivar":
                data.activo = !data.activo
                respuesta = await servicesPole.dashboard.editarUsuarios(data, data._id)
                break;

            default:
                break;
        }

        return respuesta
    }
    const acciones = async (tipo, mensaje) => {
        try {
            await serviciosAccion({ tipo: tipo })
            crearTabla()
            Tabla.getConfig().selectedRows.length = 0
            addData("alert", { severity: "success", summary: "Acción exitosa", detail: mensaje, life: 3000 })
        } catch (error) {
            console.log(error);
            addData("alert", { severity: "error", summary: "Hubo un error", detail: "Vuelve a intentarlo", life: 3000 })
        }

    }
    const accept = () => {
        acciones("eliminar", "Administrador eliminado")
    };
    const confirm1 = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Realmente deseas eliminar el administrador',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept
        });
    };
    useEffect(() => {
        if (Tabla && Tabla.getConfig().selectedRows.length == 1) {
            console.log('Selected rows:', Tabla.getConfig().selectedRows);
        }
    }, [Tabla]);
    useEffect(() => {
        crearTabla()
    }, [])
    return (
        <div>
            <TituloAdmin titulo={"Hola, " + data?.sesion?.nombre} descripcion={"Bienvenido al panel de administración de DUAL Studio"} />
            <div className="row">
                <div className="col col-12 col-md-3">
                    <div className="card card-efect p-4 pointer" onClick={() => addData("vista", { vista: "Estudiantes", idx: 1 })}>
                        <div className="row">
                            <div className="col col-8">
                                <p className="m-0">Estudiantes activos</p>
                                <strong className="fz-30">{Dash?.numeroEstudiantes}</strong>
                                <p>Ver detalles <span className="pi pi-arrow-right"></span></p>
                            </div>
                            <div className="col col-4">
                                <Avatar icon="pi pi-users" size="large" className="icon-admin" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col col-12 col-md-3">
                    <div className="card card-efect p-4 pointer" onClick={() => addData("vista", { vista: "Instructores", idx: 5 })}>
                        <div className="row">
                            <div className="col col-8">
                                <p className="m-0">Instructores</p>
                                <strong className="fz-30">{Dash?.numeroInstructores}</strong>
                                <p>Ver detalles <span className="pi pi-arrow-right"></span></p>
                            </div>
                            <div className="col col-4">
                                <Avatar icon="pi pi-user-plus text-success" size="large" className="icon-admin" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col col-12 col-md-3">
                    <div className="card card-efect p-4 pointer" onClick={() => addData("vista", { vista: "Clases", idx: 2 })}>
                        <div className="row">
                            <div className="col col-8">
                                <p className="m-0">Clases hoy</p>
                                <strong className="fz-30">{Dash?.clasesHoy}</strong>
                                <p>Ver detalles <span className="pi pi-arrow-right"></span></p>
                            </div>
                            <div className="col col-4">
                                <Avatar icon="pi pi-calendar text-dual-2" size="large" className="icon-admin" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col col-12 col-md-3">
                    <div className="card card-efect p-4 pointer" onClick={() => addData("vista", { vista: "Pagos", idx: 6 })}>
                        <div className="row">
                            <div className="col col-8">
                                <p className="m-0">Ingresos del mes</p>
                                <strong className="fz-30">${Dash?.ingresosMes}</strong>
                                <p>Ver detalles <span className="pi pi-arrow-right"></span></p>
                            </div>
                            <div className="col col-4">
                                <Avatar icon="pi pi-credit-card text-warning" size="large" className="icon-admin" />
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="col col-12 col-md-8">
                    <div className="card card-efect p-4">
                        <div className="row">
                            <div className="col col-6">
                                <strong>Estudiantes Recientes</strong>
                            </div>
                            <div className="col col-6 text-end">
                                <p>Ver todos <span className="pi pi-arrow-right"></span></p>
                            </div>
                            <div className="col col-12 centrar">
                                <div className="w-100">
                                    <div className="p-3 row estuden-lis">
                                        <div className="col col-2 d-flex justify-content-center align-items-center">
                                            <Avatar label="B" className='icon-admin' shape="circle" />
                                        </div>
                                        <div className="col col-8">
                                            <p className="m-0">Brenda Paola Godoy Rosas</p>
                                            <small className="text-gra  y-2 fz-12">babydulceprincesita09@gmail.com</small>
                                        </div>
                                        <div className="col col-2 d-flex justify-content-center align-items-center">
                                            <Tag severity="secondary" value="Intermedio" rounded></Tag>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col col-12 col-md-4">
                    <div className="card card-efect p-4">
                        <p><strong><span className="pi pi-clock me-2"></span>Proximas clases</strong></p>
                        <Message severity="warn" text={clase} className="p-message p-message-warn br-15" />
                        <p className="p-4 text-center">No hay clases programadas</p>
                    </div>
                </div> */}
                <div className="col col-12">
                    {global.administradores.length == 0 ?
                        <SinContenido icon={"pi pi-box"} titulo={"No hay producto"} descripcion={"Comienza agregando tu primer producto"} btnLabel={"Agregar producto"} /> :
                        <div className="row">
                            <div className="col col-12 col-md-6"><h3>Usuarios:</h3></div>
                            <div className="col col-12 col-md-6 text-end d-flex">
                                {/* {console.log(Tabla?.getConfig()?.selectedRows[0])} */}
                                <ConfirmPopup />
                                {Tabla?.getConfig()?.selectedRows?.length == 1 ?
                                    <div className="d-flex">
                                        <Button icon="pi pi-eye" label={Tabla?.getConfig()?.selectedRows[0].activo ? "Desactivar admin" : "Activar admin"} severity={Tabla?.getConfig()?.selectedRows[0].activo ? "warning" : "success"} className="ms-auto br-15 me-2" onClick={() => acciones("desactivar", "Usuario actualizado exitosamente")} />
                                        <Button icon="pi pi-trash" label="Eliiminar admin" severity="danger" className="br-15 me-2" onClick={confirm1} />
                                        <Button icon="pi pi-plus" label="Crear admin" className="btn-dual br-15" onClick={() => crearAdmin()} />

                                    </div> :
                                    <Button icon="pi pi-plus" label="Crear admin" className="ms-auto btn-dual br-15" onClick={() => crearAdmin()} />
                                }

                            </div>
                            <div className="col col-12">
                                <TablaPersonaliza
                                    datos={Tabla}
                                    control={setTabla}
                                    recarga={crearTabla}
                                />
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}