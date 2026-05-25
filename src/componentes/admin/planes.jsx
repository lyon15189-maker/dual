import { Button } from "primereact/button";
import TituloAdmin from "../tituloAdmin";
import { useEffect, useState } from "react";
import CreadorFormularios from "../CreadorFormularios";
import global from "@/js/jsons/global";
import { cumplioEstructura, logE, obtenerFecha, validarEstructura, validarFormulario } from "@/js/scrips";
import Modal from "../modal";
import SinContenido from "../sinContendio";
import { Chip } from "primereact/chip";
import { InputSwitch } from "primereact/inputswitch";
import ListadoUsuario from "../listadoUsuario";
import { Tag } from "primereact/tag";
import { useGlobalStore } from "@/stores/itemStore";
import { servicesPole } from "@/service/api";
import { Avatar } from "primereact/avatar";
const fPromociones = [
    { id: "activa", type: "switch", title: "", classDiv: "col col-12", classLabel: "d-none" },
]
const fPromocionesCrear = [
    { id: "nombre", type: "text", title: "Nombre del cupon", classDiv: "col col-12", required: true, error: "El campo Promoción es requerido" },
    { id: "descuento", type: "select", title: "Tipo de descuento", classDiv: "col col-12 col-md-6", required: true, error: "El campo Tipo de descuento es requerido", options: [{ nombre: "Porcentaje", valor: "porcentaje" }, { nombre: "Fijo", valor: "fijo" },], optionLabel: "nombre", optionValue: "valor" },
    { id: "cantidad", type: "number", title: "Valor de descuento", classDiv: "col col-12 col-md-6", required: true, error: "El campo Valor de descuento es requerido" },
    { id: "codigo", type: "text", title: "Código de descuento", classDiv: "col col-12 col-md-6", disabled: true },
    { id: "aplica", type: "select", title: "Aque aplica", classDiv: "col col-12 col-md-6", required: true, error: "El campo Aque aplica es requerido", options: [{ nombre: "Clase", valor: "clase" }, { nombre: "Plan", valor: "plan" }, { nombre: "Prodcuto", valor: "prodcuto" },], optionLabel: "nombre", optionValue: "valor" },
    { id: "fechaInicio", type: "calendar", title: "Fecha inicio", classDiv: "col col-12 col-md-6" },
    { id: "fechaFin", type: "calendar", title: "Fecha fin", classDiv: "col col-12 col-md-6" },
    { id: "usos", type: "number", title: "Usos maximos", classDiv: "col col-12 col-md-12" },
    { id: "descripcion", type: "textArea", title: "Descripción", classDiv: "col col-12" },
]
const fNuevoPlan = [
    { id: "nombre", type: "text", title: "Nombre del plan", classDiv: "col col-12", placeholder: "Nombre del plan..." },
    { id: "precio", type: "number", title: "Precio", classDiv: "col col-6", placeholder: "Precio..." },
    { id: "duracion", type: "number", title: "Duración (días)", classDiv: "col col-6", placeholder: "Duración (días)..." },
    { id: "clases", type: "number", title: "Clases", classDiv: "col col-12", placeholder: "Clases..." },
    { id: "descripcion", type: "textArea", title: "Descripción", classDiv: "col col-12", placeholder: "Descripción..." },
]
export default function Planes() {
    const [Formulario, setFormulario] = useState({ activa: true })
    const [Planes, setPlanes] = useState({ editar: false, data: [] })
    const [Cupones, setCupones] = useState({ editar: false, data: [] })
    const [ModalC, setModalC] = useState({ activar: false, header: "Nueva promoción", style: { width: "50%", margin: "auto" }, class: "bg-admin modal-container" })
    const { addData } = useGlobalStore();
    const accionesServicio = async (tipo, datos) => {
        let res = {}
        let obj = datos
        // ✅ imágenes (MULTIPLE)
        switch (tipo) {
            case "eliminarCuponA":
                res = await servicesPole.cupones.eliminarCupones(Formulario._id)
                break;
            case "editarCuponA":
                // console.log("52", datos);
                res = await servicesPole.cupones.editarCupones(Formulario._id, datos)
                break;
            case "crearCupon":
                obj.fechaInicio = obtenerFecha({ date: obj.fechaInicio, separador: "-" }).formato
                obj.fechaFin = obtenerFecha({ date: obj.fechaFin, separador: "-" }).formato
                res = await servicesPole.cupones.crearCupones(obj)
                break;
            case "eliminarPlanA":
                res = await servicesPole.plan.eliminarPlanes(Formulario._id)
                break;
            case "editarPlanA":
                res = await servicesPole.plan.editarPlanes(Formulario._id, datos)
                break;
            case "crear":
                res = await servicesPole.plan.crearPlanes(datos)
                break;

            default:
                break;
        }
        return res
    }
    const acciones = async ({ tipo = "crear", template = {}, formulario = [], mensaje = "" } = {}) => {
        addData("load", { activo: true, mensaje: "Cargando..." })
        // console.log("57", template, Formulario);
        let res = validarEstructura(template, Formulario)
        let validacionFormulario = validarFormulario(formulario, Formulario)
        // console.log("59", cumplioEstructura(res), validacionFormulario);
        if (cumplioEstructura(res) && validacionFormulario.length == 0) {
            try {
                await accionesServicio(tipo, res.value)
                addData("load", { activo: false, mensaje: "Cargando..." })
                addData("notificacion", { severity: 'success', summary: 'Acción completada', detail: mensaje, life: 3000 })
                setFormulario({})
                consultarData()
                setModalC({ ...ModalC, activar: false })
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
    const accionesGlobal = (tipo, data) => {
        switch (tipo) {
            case "eliminarcupon":
                acciones({ tipo: "eliminarCuponA", mensaje: "Cupon eliminado", template: global.crearCupon, formulario: fPromocionesCrear })
                break;
            case "editarcupon":
                acciones({ tipo: "editarCuponA", mensaje: "Cupon actualizado", template: global.crearCupon, formulario: fPromocionesCrear })
                break;
            case "eliminarCupon":
            case "editarCupon":
                // console.log(data);
                let obj = data
                obj.fechaInicio = obtenerFecha({ date: data.fechaInicio }).format
                obj.fechaFin = obtenerFecha({ date: data.fechaFin }).format
                setFormulario(data)
                setModalC({ ...ModalC, activar: true, tipo: "cupon", title: "Editar cupon", estado: "editar" })
                break;
            case "eliminarPlan":
            case "editarPlan":
                // console.log(data);
                setFormulario(data)
                setModalC({ ...ModalC, activar: true, tipo: "plan", title: "Editar plan", estado: "editar" })
                break;
            case "eliminarplan":
                acciones({ tipo: "eliminarPlanA", mensaje: "Plan eliminado", template: global.crearPlan, formulario: fNuevoPlan })
                break;
            case "editarplan":
                acciones({ tipo: "editarPlanA", mensaje: "Plan actualizado", template: global.crearPlan, formulario: fNuevoPlan })
                break;
            case "crearcupon":
                acciones({ tipo: "crearCupon", mensaje: "Cupon creado", template: global.crearCupon, formulario: fPromocionesCrear })
                break;
            case "crearplan":
                acciones({ tipo: "crear", mensaje: "Plan creado", template: global.crearPlan, formulario: fNuevoPlan })
                break;
            default:
                break;
        }
    }
    const consultarData = async () => {
        let consultaPlan = await servicesPole.plan.consultarPlanes()
        let consultaCupon = await servicesPole.cupones.consultarCupones()
        setPlanes({ ...Planes, data: consultaPlan.data })
        // consultaCupon.data.fechaInicio = consultaCupon?.data?.fechaInicio?.split("T")[0]
        // consultaCupon.data.fechaFin = consultaCupon?.data?.fechaFin?.split("T")[0]
        // console.log(consultaCupon.data);
        setCupones({ ...Cupones, data: consultaCupon.data })
    }
    const formatearFecha = (fecha) => {
        if (!fecha) return "";
        const f = new Date(fecha);
        return f.toLocaleDateString("es-MX");
    };

    useEffect(() => {
        consultarData()
    }, [])
    return (
        <div>
            <Modal data={ModalC} control={setModalC}>
                <div className="mb-5">
                    <CreadorFormularios
                        key="formulario-Plan"
                        campos={ModalC.tipo == "plan" ? fNuevoPlan : fPromocionesCrear}
                        datos={Formulario}
                        control={setFormulario}
                    />
                </div>
                <div className="acciones-modal d-flex text-end">
                    <Button label="Cancelar" className="br-15 me-2 ms-auto" severity="secondary" text raised onClick={() => { setModalC({ ...ModalC, activar: false, tipo: "crear" }) }} />
                    {ModalC.estado == "editar" &&
                        <Button label={"Eliminar"} className="btn btn-dual br-15 me-2" onClick={() => accionesGlobal("eliminar" + ModalC.tipo)} />
                    }
                    <Button label={ModalC.estado == "editar" ? "Editar" : "Crear"} className="btn btn-dual br-15" onClick={() => ModalC.estado == "editar" ? accionesGlobal("editar" + ModalC.tipo) : accionesGlobal("crear" + ModalC.tipo)} />
                </div>
            </Modal>
            <div className="row">
                <div className="col col-7">
                    <TituloAdmin titulo={"Planes"} descripcion={"Gestiona ofertas especiales para tus estudiantes"} />
                </div>
                <div className="col col-5 text-end d-flex align-items-center">
                    <div className="ms-auto d-flex">
                        <Button icon="pi pi-plus" label="Nuevo plan" className="ms-auto btn-dual br-15 me-3" onClick={() => setModalC({ ...ModalC, activar: true, tipo: "plan", title: "Crear plan" })} />
                        <Button icon="pi pi-plus" label="Nuevo cupon" className="ms-auto btn-dual br-15 me-3" onClick={() => { setModalC({ ...ModalC, activar: true, tipo: "cupon", title: "Crear cupon", estado: "nuevo" }), setFormulario(global.crearCupon) }} />
                    </div>
                </div>
            </div>
            <div className="row">
                {Planes?.data?.map((e, i) => {
                    return (
                        <div className="col col-12 col-md-4" key={"planes" + i}>
                            <div className="card p-3 card-efect">
                                <div className="row">
                                    <div className="col col-6"><strong>{e.nombre}</strong></div>
                                    <div className="col col-6 text-end">
                                        <Button className="btn-circulo " icon="pi pi-pencil" rounded outlined severity="warning" aria-label="editar" onClick={() => accionesGlobal("editarPlan", e)} />
                                    </div>
                                </div>
                                <p className="fz-30 text-dual m-0"><strong>${e.precio}.00</strong></p>
                                <p className="m-0 text-gray"><span className="pi pi-clock me-2"></span>{e.duracion} días</p>
                                <p className="m-0 text-gray"><span className="pi pi-check-circle me-2"></span>{e.clases} clases</p>
                                <p>{e.descripcion}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
            <hr />
            <div className="row">
                <div className="col col-md-12">
                    <TituloAdmin titulo={"Cupones"} descripcion={"Gestiona cupones especiales para tus estudiantes"} />
                </div>
                {/* {console.log(Cupones)} */}
                {Cupones?.data?.length > 0 ?
                    Cupones?.data?.map((e, i) => {
                        return (
                            <div className="col col-12 col-md-4" key={"promocion" + i}>
                                <div className="card card-efect p-3 br-15">
                                    <div className="row">
                                        <div className="col col-8">
                                            <div className="card-efect card text-start br-15 ps-4 pe-4 pt-1 pb-1">
                                                <div className="row">
                                                    <div className="col col-2 d-flex align-items-center">
                                                        {/* {item.alumno.avatar} */}
                                                        <Avatar icon={"pi pi-check-circle"} className={'icon-admin p-3 '} shape="circle" />
                                                    </div>
                                                    <div className="col col-9 text-center">
                                                        <div className="m-0 fz-15 text-gray ms-2">{e.nombre}</div>
                                                        <div className="m-0 fz-12 text-gray-2 ms-2">
                                                            <strong className={"fz-8 "}>
                                                                <span>{e.codigo}</span>
                                                            </strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col col-4 text-end">
                                            <Tag severity={"danger"} value={`- ${e.cantidad} ${e.descuento == "porcentaje" ? "%" : "$"}`} rounded className="bg-dual-2 text-white ps-2 pe-2"></Tag>
                                            <Button className="btn-circulo mt-2" icon="pi pi-pencil" rounded outlined severity="warning" aria-label="editar" onClick={() => accionesGlobal("editarCupon", e)} />
                                        </div>
                                        <div className="col col-12">
                                            <p className="mb-2">{e.descripcion}</p>
                                            <p className="m-0">
                                                <span className="pi pi-calendar me-2">
                                                </span>{formatearFecha(e?.fechaInicio) + " - " + formatearFecha(e?.fechaFin)}
                                            </p>
                                            <p className="m-0">{e.usos}</p>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }) :
                    <SinContenido icon={"pi pi-list"} titulo={"No hay promociones"} descripcion={"Comienza agregando tu primer promocion"} btnLabel={"Nueva promoción"} accion={() => setModalC({ ...ModalC, activar: true, tipo: "plan" })} />
                }
            </div>

        </div>
    )
}