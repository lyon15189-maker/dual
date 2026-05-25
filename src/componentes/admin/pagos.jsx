import { Button } from "primereact/button";
import TituloAdmin from "../tituloAdmin";
import { useEffect, useState } from "react";
import CreadorFormularios from "../CreadorFormularios";
import global from "@/js/jsons/global";
import { cumplioEstructura, logE, obtenerFecha, validarEstructura, validarFormulario } from "@/js/scrips";
import Modal from "../modal";
import TablaPersonaliza from "../TablaPersonaliza";
import TableConfig from "@/js/clases/POOTabla";
import { Tag } from "primereact/tag";
import SinContenido from "../sinContendio";
import { servicesPole } from "@/service/api";
import { useGlobalStore } from "@/stores/itemStore";
import { Avatar } from "primereact/avatar";

// Estructura base limpia (Actúa como molde inicial)
const estructuraBaseFormulario = [
    { id: "usuario", type: "select", title: "Estudiante", classDiv: "col col-12", options: [], optionLabel: "nombre", optionValue: "_id", required: true, error: "El campo estudiante es requerido" },
    { id: "metodoPago", type: "select", title: "Metodo de pago", classDiv: "col col-12 col-md-6", options: [{ name: "Efectivo", value: "efectivo" }, { name: "Transferencia", value: "transferencia" }, { name: "Stripe", value: "stripe" }], optionLabel: "name", optionValue: "value", required: true, error: "El campo metodo de pago es requerido" },
    { id: "tipo", type: "select", title: "Tipo", classDiv: "col col-12 col-md-6", options: [{ name: "Plan", value: "plan" }, { name: "Clase individual", value: "clase" }], optionLabel: "name", optionValue: "value", required: true, error: "El campo tipo es requerido" },
    { id: "items", type: "select", title: "Que se va a pagar", classDiv: "col col-12 col-md-6", options: [], optionLabel: "nombre", optionValue: "_id", required: true, error: "El campo que se va a pagar es requerido" },
    { id: "codigoCupon", type: "select", title: "Cupon", classDiv: "col col-12 col-md-6", options: [], optionLabel: "label", optionValue: "codigo" },
];

const frClase = [
    { id: "hora", type: "horario", title: "Hora", classDiv: "col col-12 col-md-6 max-width", placeholder: "fecha", classLabel: "", timeOnly: true, required: true, error: "El campo hoario es requerido" },
    { id: "fecha", type: "calendar", title: "Fecha", classDiv: "col col-12 col-md-6 max-width", placeholder: "fecha", classLabel: "", required: true, error: "El campo fecha es requerido" },
    { id: "precio", type: "number", title: "Precio", classDiv: "col col-12 col-md-6", required: true, error: "El campo precio es requerido" },
];

const fNotas = [
    { id: "notas", type: "textArea", title: "Notas", classDiv: "col col-12", placeholder: "Notas de pago" },
];
const fechasPagos = [
    { id: "fechasPagos", type: "calendar", title: "", classDiv: "col col-12 col-md-12 max-width", placeholder: "fecha", classLabel: "d-none", selectionMode: "range", readOnlyInput: true, hideOnRangeSelection: true },
]

const crearEstructura = global.crearPago;
const modalGlobal = { activar: false, header: "Forma de pago", style: { width: "50%", margin: "auto" }, class: "bg-admin modal-container" }
export default function Pagos() {
    const [Tabla, setTabla] = useState(null);
    const [Tabla2, setTabla2] = useState(null);
    const [Formulario, setFormulario] = useState(crearEstructura);
    const [Rango, setRango] = useState({ fechasPagos: [] });
    const [Resumen, setResumen] = useState({});
    const [camposFormulario, setCamposFormulario] = useState(estructuraBaseFormulario);
    const [listaAlumnos, setListaAlumnos] = useState([]); // 🔥 Estado para recordar los alumnos cargados
    const [ModalC, setModalC] = useState(modalGlobal);
    const { data, addData } = useGlobalStore();

    const accionesServicio = async (tipo, datos) => {
        let res = {};
        let obj = datos
        let objCompra = {}
        // console.log("55", tipo, datos, Formulario);
        function crearpagoTipo() {
            switch (Formulario.tipo) {
                case "plan":
                    console.log("59", Formulario, datos);
                    objCompra.id = Formulario.objS._id
                    objCompra.tipo = Formulario.tipo
                    obj.items = [objCompra]
                    obj.usuario = Formulario.usuario
                    obj.codigoCupon = Formulario.codigoCupon == undefined ? "" : Formulario.codigoCupon
                    return obj
                case "clase":
                    // console.log("66",Formulario, datos);
                    objCompra.id = Formulario.objS._id
                    objCompra.tipo = Formulario.tipo
                    objCompra.precio = Formulario.precio
                    objCompra.instructor = Formulario.objS.instructor._id
                    objCompra.fecha = obtenerFecha({ date: Formulario.fecha, separador: "-" }).formato
                    objCompra.hora = String(Formulario.hora.getHours()).padStart(2, '0') + ':' + String(Formulario.hora.getMinutes()).padStart(2, '0')
                    obj.items = [objCompra]
                    obj.usuario = Formulario.usuario
                    obj.codigoCupon = Formulario.codigoCupon == undefined ? "" : Formulario.codigoCupon
                    return obj

                default:
                    break;
            }
        }
        switch (tipo) {
            case "activarPago":
                res = await servicesPole.pagos.activarPagos(Formulario._id)
                break;
            case "validarPago":
                // console.log("84", tipo, datos, Formulario);
                res = await servicesPole.pagos.validarPagos(Formulario._id)
                break;
            case "cancelarPago":
                res = await servicesPole.pagos.cancelarPagos(Formulario._id)
                break;
            case "eliminarPago":
                // console.log("82", tipo, datos, Formulario);
                res = await servicesPole.pagos.eliminarPagos(Formulario._id)
                break;
            case "crear":
                // console.log("51", );
                res = await servicesPole.pagos.crearPagos(crearpagoTipo())
                break;
            default:
                break;
        }
        return res;
    };

    const acciones = async ({ tipo = "crear", template = crearEstructura, formulario = estructuraBaseFormulario, mensaje = "Registrando alumno" } = {}) => {
        addData("load", { activo: true, mensaje: "Cargando..." });
        // console.log("109", template, formulario, tipo);
        let res = validarEstructura(template, Formulario);
        let validacionFormulario = formulario.length == 0 ? [] : validarFormulario(formulario, Formulario);
        // console.log("112", cumplioEstructura(res), validacionFormulario, Formulario);
        if (cumplioEstructura(res) && validacionFormulario.length == 0) {
            try {
                await accionesServicio(tipo, res.value);
                // console.log(respuesta);
                addData("load", { activo: false, mensaje: "Cargando..." });
                addData("notificacion", { severity: 'success', summary: 'Acción completada', detail: mensaje, life: 3000 });
                setModalC(modalGlobal);
                Tabla.getConfig().selectedRows.length = 0
                init()
            } catch (error) {
                addData("load", { activo: false, mensaje: "Cargando..." });
                console.log("119", error);
                addData("notificacion", { severity: 'error', summary: 'Hubo un problema', detail: error?.data?.message ?? 'Ocurrió un error inesperado', life: 3000 });
            }
        } else {
            console.log("123", Formulario);
            addData("load", { activo: false, mensaje: "Cargando..." });
            addData("notificacion", { severity: 'error', summary: 'Hubo un problema', detail: validacionFormulario[0]?.mensaje, life: 3000 });
        }
    };

    const accionesGlobal = (tipo) => {
        switch (tipo) {
            case "activarPago":
                acciones({ tipo: "activarPago", mensaje: "Pago activado", formulario: [], template: {} });
                break;
            case "validarPago":
                acciones({ tipo: "validarPago", mensaje: "Pago validado", formulario: [], template: {} });
                break;
            case "cancelarPago":
                acciones({ tipo: "cancelarPago", mensaje: "Pago cancelado", formulario: [], template: {} });
                break;
            case "eliminarPago":
                acciones({ tipo: "eliminarPago", mensaje: "Pago eliminado", formulario: [], template: {} });
                break;
            case "generarPago":
                acciones({ tipo: "crear", mensaje: "Pago realizado", formulario: camposFormulario }); // 👈 Mandar formulario activo para validar
                break;
            default:
                break;
        }
    };

    const crearTabla = async (finicio, ffin) => {
        try {
            let listaUsuariosC = []
            if (data.sesion.rol == "admin" || data.sesion.rol == "maestro") {
                let listaResumen = await servicesPole.pagos.consultarResumen(finicio, ffin);
                console.log("162", listaResumen.data);
                setResumen(listaResumen?.data || {})
                listaUsuariosC = await servicesPole.dashboard.ObtenerUsuarios({ roles: "alumno" }).data
                setListaAlumnos(listaUsuariosC || []); // Guardamos globalmente los alumnos en el componente
                // Inyectamos inicialmente los alumnos en la estructura base
                setCamposFormulario(prev => {
                    const nuevaCopia = [...prev];
                    nuevaCopia[0] = { ...nuevaCopia[0], options: listaUsuariosC || [] };
                    return nuevaCopia;
                });
            } else {
                listaUsuariosC = await servicesPole.dashboard.ObtenerUnUsuario(data.sesion._id)
                setListaAlumnos([listaUsuariosC.data]); // Guardamos globalmente los alumnos en el componente
                // Inyectamos inicialmente los alumnos en la estructura base
                setCamposFormulario(prev => {
                    const nuevaCopia = [...prev];
                    nuevaCopia[0] = { ...nuevaCopia[0], options: [listaUsuariosC.data] };
                    return nuevaCopia;
                });
                // console.log("102", { ...Formulario, usuario: listaUsuariosC?.data?._id });
                setFormulario({ ...Formulario, usuario: listaUsuariosC?.data?._id, metodoPago: "efectivo", tipo: "plan" })
            }
            // data.sesion.rol
            // let listaUsuarios = await servicesPole.dashboard.ObtenerUsuarios({ roles: "alumno" });
            let listaPagos = data.sesion.rol == "admin" || data.sesion.rol == "maestro" ? await servicesPole.pagos.consultarPagos(finicio, ffin) : await servicesPole.pagos.consultarPagosUsuario(finicio, ffin, data.sesion._id);
            // console.log("102", listaUsuariosC);

            const tbl = new TableConfig();
            tbl.addCol("_id", "ID", true, false, { type: "text", style: { display: "none" } });
            // tbl.addCol("fechaPago", "Fecha del pago", true, false);
            tbl.addCol("fechaPago", "Fecha del pago", true, false, {
                type: 'text',
                body: (rowData) => (
                    <div className="text-start">
                        <p>{rowData?.fechaPago?.split("T")[0]}</p>
                    </div>
                )
            }, false, "max-content");
            tbl.addCol("usuario.nombre", "Usuario", true, false, {
                type: 'text',
                body: (rowData) => (
                    <div className="text-start" key={"nivel"}>
                        <p>{rowData?.usuario?.nombre + " " + rowData?.usuario?.apellidos}</p>
                    </div>
                )
            }, false, "max-content");
            tbl.addCol("items.[0].tipo", "Tipos", true, false, {
                type: 'text',
                body: (rowData) => (
                    <div className="text-start" key={"nivel"}>
                        {rowData?.items.map((e, i) => {
                            return (
                                <Tag severity="primary" value={e.tipo} rounded className="me-2" key={rowData?._id + "tipos" + i} />
                            )
                        })}
                    </div>
                )
            }, false, "max-content");
            tbl.addCol("metodoPago", "Método", true, false);
            tbl.addCol("estado", "Estado", true, false, {
                type: 'text',
                body: (rowData) => (
                    <div className="text-start" key={"nivel"}>
                        <Tag severity={rowData?.estado == "pagado" ? "success" : rowData?.estado == "cancelado" ? "error" : "warning"} value={rowData?.estado} rounded className="mt-2"></Tag>

                    </div>
                )
            }, false, "max-content");
            tbl.addCol("total", "Monto", true, false, {
                type: 'text',
                body: (rowData) => (
                    <strong className="mt-2 text-start">${rowData?.total}</strong>
                )
            }, false, "max-content");
            // tbl.addData([]);
            tbl.addData(listaPagos?.data || []);
            tbl.addDataKey('alumnosTabla');
            setTabla(tbl);
        } catch (error) {
            console.log(error);
        }
    };
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
    const templateModal = () => {
        // console.log(Formulario);
        const tbl2 = new TableConfig();
        tbl2.addCol("_id", "ID", true, false, { type: "text", style: { display: "none" } });
        tbl2.addCol("tipo", "Tipo", true, false);
        tbl2.addCol("nombre", "Nombre", true, false);
        tbl2.addCol("precioUnitario", "Precio Unitario", true, false);
        tbl2.addCol("subtotal", "Subtotal", true, false);
        tbl2.addDataKey('itemsCompra')
        tbl2.toogleChecks(false)
        tbl2.addData(Formulario?.items)
        switch (ModalC.tipo) {
            case "seleccion":
                return (
                    <div className="container mt-4">
                        <div className="card shadow border-0 ">
                            <div className="card-body">
                                <div className="row justify-content-between align-items-center mb-4">
                                    <div className="col col-12 col-md-6">
                                        <h2 className="mb-1">
                                            Detalle del Pago
                                        </h2>
                                        <small className="text-muted">
                                            ID:
                                            {Formulario._id}
                                        </small>
                                    </div>
                                    <div className="col col-12 col-md-6">
                                        <Tag
                                            value={Formulario.estado}
                                            severity={Formulario.estado == "pagado" ? "success" : Formulario.estado == "cancelado" ? "danger" : "warning"}
                                        />
                                    </div>
                                </div>
                                <div className="row g-3 mb-4">
                                    <div className="col-md-3">
                                        <div className="border rounded p-3 h-100">
                                            <small className="text-muted d-block mb-1">
                                                Método de Pago
                                            </small>
                                            <strong>
                                                {Formulario.metodoPago}
                                            </strong>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="border rounded p-3 h-100">
                                            <small className="text-muted d-block mb-1">
                                                Fecha de Pago
                                            </small>
                                            <strong>
                                                {Formulario?.fechaPago?.split("T")[0]}
                                            </strong>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="border rounded p-3 h-100">
                                            <small className="text-muted d-block mb-1">
                                                Subtotal
                                            </small>
                                            <strong>
                                                ${Formulario.subtotal}
                                            </strong>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="border rounded p-3 h-100 bg-light">
                                            <small className="text-muted d-block mb-1">
                                                Total
                                            </small>
                                            <h4 className="m-0">
                                                ${Formulario.subtotal}

                                            </h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="card mb-4">
                                    <div className="card-header fw-bold">
                                        Usuario
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <small className="text-muted d-block">
                                                    Nombre
                                                </small>
                                                <strong>
                                                    {Formulario.usuario?.nombre + " " + Formulario.usuario?.apellidos}
                                                </strong>
                                            </div>
                                            <div className="col-md-4">
                                                <small className="text-muted d-block">
                                                    Email
                                                </small>
                                                <strong>
                                                    {Formulario.usuario?.email}
                                                </strong>
                                            </div>
                                            <div className="col-md-4">
                                                <small className="text-muted d-block">
                                                    Usuario ID
                                                </small>
                                                <strong>
                                                    {Formulario.usuario?._id}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card mb-4">
                                    <div className="card-header fw-bold">
                                        Items del Pago
                                    </div>
                                    <div className="card-body">
                                        <TablaPersonaliza datos={tbl2} control={setTabla2} />
                                    </div>
                                </div>
                                <div className="card mb-4">
                                    <div className="card-header fw-bold">
                                        Descuento
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <small className="text-muted d-block">
                                                    Cupón
                                                </small>
                                                <strong>
                                                    {Formulario?.cupon?.codigo}
                                                </strong>
                                            </div>
                                            <div className="col-md-4">
                                                <small className="text-muted d-block">
                                                    Tipo Descuento
                                                </small>
                                                <strong>
                                                    {Formulario?.tipoDescuento}
                                                </strong>
                                            </div>
                                            <div className="col-md-4">
                                                <small className="text-muted d-block">
                                                    Descuento Aplicado
                                                </small>
                                                <strong>
                                                    {Formulario?.descuentoAplicado}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card mb-4">
                                    <div className="card-header fw-bold">
                                        Notas
                                    </div>
                                    <div className="card-body">
                                        <p className="m-0">
                                            {Formulario?.notas}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="acciones-modal row mt-3 text-end">
                            <div className="col col-12 col-md-2">
                                <Button label="Cerrar" className="br-15 me-2 ms-auto" severity="secondary" text raised onClick={() => { setModalC({ ...ModalC, activar: false, tipo: "crear" }), Tabla.getConfig().selectedRows.length = 0 }} />
                            </div>
                            {(data.sesion.rol == "admin" || data.sesion.rol == "maestro") &&
                                <div className="col col-12 col-md-10">
                                    {Formulario.estado == "pendiente" &&
                                        <Button label={"Validar"} className="btn btn-dual br-15 me-2" onClick={() => accionesGlobal("validarPago")} />
                                    }
                                    {Formulario.estado == "cancelado" ?
                                        <Button label={"Activar"} className="btn btn-dual br-15 me-2" onClick={() => accionesGlobal("activarPago")} /> :
                                        <Button label={"Cancelar"} className="btn btn-dual br-15 me-2" onClick={() => accionesGlobal("cancelarPago")} />
                                    }
                                    <Button label={"Eliminar"} className="btn btn-dual br-15 me-2" onClick={() => accionesGlobal("eliminarPago")} />
                                </div>
                            }
                        </div>
                    </div>
                )
            case "crear":
                return (
                    <div>
                        <div className="mb-5">
                            <CreadorFormularios
                                key="crear-pagos"
                                campos={camposFormulario}
                                datos={Formulario}
                                control={setFormulario}
                            />
                        </div>
                        <div className="acciones-modal d-flex text-end">
                            <Button label="Cancelar" className="br-15 me-2 ms-auto" severity="secondary" text raised onClick={() => { setModalC({ ...ModalC, activar: false, tipo: "crear" }); if (Tabla) Tabla.getConfig().selectedRows.length = 0; }} />

                            <Button label={"Crear"} className="btn btn-dual br-15" onClick={() => accionesGlobal("generarPago")} />
                        </div>
                    </div>
                )

            default:
                break;
        }
    }
    useEffect(() => {
        if (Tabla && Tabla.getConfig().selectedRows.length == 1) {
            let seleccion = Tabla.getConfig().selectedRows
            // console.log("463", seleccion);
            setFormulario(seleccion[0])
            setModalC({ ...ModalC, activar: true, tipo: "seleccion", titulo: "Registro de pago" })
        } else {
            // console.log("467");
            setFormulario({ ...crearEstructura, ...Formulario })
        }
    }, [Tabla])
    // 🔥 EFECTO DINÁMICO CORREGIDO: Reconstruye la estructura limpia según el tipo seleccionado
    useEffect(() => {
        if (!Formulario.tipo) return;

        async function servicios(tipo) {
            let re = {};
            let listaCupones = {}
            listaCupones = await servicesPole.cupones.consultarCuponesFiltro("disponibles=true&aplica=" + tipo);
            listaCupones.data.forEach(e => {
                e.label = `${e.nombre} ${e.descuento == "fijo" ? "-" + e.cantidad : e.cantidad + "%"} (${e.codigo})`
            });
            estructuraBaseFormulario[4].options = listaCupones.data
            // console.log("444", listaCupones);
            switch (tipo) {
                case "clase":
                    setFormulario({ ...Formulario, hora: new Date(), fecha: new Date() })
                    re = await servicesPole.clases.consultarClases();
                    break;
                case "plan":
                    re = await servicesPole.plan.consultarPlanes();
                    break;
                default:
                    break;
            }
            return re;
        }

        async function cargarData(tipo) {
            try {
                let res = await servicios(tipo);

                // 1. Tomamos siempre el molde LIMPIO original (estructuraBaseFormulario)
                let nuevaEstructura = [...estructuraBaseFormulario];

                // 2. Mantenemos los alumnos que ya habíamos cargado previamente
                // console.log("499", listaAlumnos);
                nuevaEstructura[0] = { ...nuevaEstructura[0], options: listaAlumnos };

                // 3. Inyectamos los planes o clases correspondientes en la posición de 'items'
                nuevaEstructura[3] = { ...nuevaEstructura[3], options: res.data || [] };
                setFormulario({ ...Formulario, items: res.data[0]._id, codigoCupon: "" })

                // 4. Concatenamos los campos adicionales según el tipo
                if (tipo === "clase") {
                    nuevaEstructura = nuevaEstructura.concat(frClase).concat(fNotas);
                } else if (tipo === "plan") {
                    nuevaEstructura = nuevaEstructura.concat(fNotas);
                }

                // 5. Guardamos el resultado final limpio en el estado
                setCamposFormulario(nuevaEstructura);

            } catch (error) {
                console.log(error);
            }
        }

        cargarData(Formulario.tipo);
    }, [Formulario.tipo, listaAlumnos]); // Re-ejecuta si cambia el tipo o si se actualiza la lista de alumnos

    // 🔥 EFECTO CORREGIDO PARA SELECCIONAR ITEM
    useEffect(() => {
        if (!Formulario.items) return;

        const opcionesActuales = camposFormulario[3]?.options || [];
        let objSelect = opcionesActuales.find(e => e._id === Formulario.items);

        if (objSelect) {
            setFormulario(prev => ({ ...prev, objS: objSelect }));
        }
    }, [Formulario.items]);

    useEffect(() => {
        if (Rango.fechasPagos.length > 0 && (Rango.fechasPagos[0] !== null && Rango.fechasPagos[1] !== null)) {
            let inicioMes = obtenerFecha({ date: Rango.fechasPagos[0], separador: "-" }).formato
            let finMes = obtenerFecha({ date: Rango.fechasPagos[1], separador: "-" }).formato
            // console.log("291", inicioMes, finMes);
            crearTabla(inicioMes, finMes)
        }
    }, [Rango.fechasPagos]);
    const init = () => {
        let fechaMes = obtenerFecha({ date: new Date() })
        let inicioMes = obtenerFecha({ date: fechaMes.inicioMes, separador: "-" }).format
        let finMes = obtenerFecha({ date: fechaMes.finMes, separador: "-" }).format
        setRango({ fechasPagos: [inicioMes, finMes] })
    }
    useEffect(() => {
        // console.log(data.sesion.rol);
        init()
    }, []);

    return (
        <div>
            <Modal data={ModalC} control={setModalC}>
                {templateModal()}
            </Modal>

            {/* El resto de tu layout (Cards de totales y TablaPersonaliza) permanece intacto */}
            <div className="row">
                <div className="col col-12 col-md-5">
                    <TituloAdmin titulo={"Pagos"} descripcion={"Gestiona pagos y membresías"} />
                </div>
                <div className="col col-12 col-md-7 text-end d-flex align-items-center">
                    <div className="ms-auto row">
                        <div className="col col-12 col-md-6">
                            <CreadorFormularios
                                key="formulario-pagos"
                                campos={fechasPagos}
                                datos={Rango}
                                control={setRango}
                            />
                        </div>
                        <div className="col col-12 col-md-6">
                            <Button icon="pi pi-plus" label="Registrar pago" className="ms-2 mt-2 btn-dual br-15 me-3" onClick={() => setModalC({ ...ModalC, activar: true, tipo: "crear" })} />

                        </div>
                    </div>
                </div>
                {/* Cards de métricas */}
                {data.sesion.rol == "admin" &&
                    <div className="col col-12 col-md-4">
                        <div className="ps-3">
                            {templateValores({ icon: "pi pi-users", color: "text-primary", titulo: "Total ingresos", des: "$" + Resumen?.ingresosTotales })}
                        </div>
                    </div>
                }
                {data.sesion.rol == "admin" &&
                    <div className="col col-12 col-md-4">
                        <div className="ps-3">
                            {templateValores({ icon: "pi pi-dollar", color: "text-dual", titulo: "Total pagos", des: Resumen?.usuariosPagaron })}
                        </div>
                    </div>
                }
                {data.sesion.rol == "admin" &&
                    <div className="col col-12 col-md-4">
                        <div className="ps-3">
                            {templateValores({ icon: "pi pi-calendar", color: "text-dual-2", titulo: "Planes activos", des: Resumen?.usuariosConPlan })}
                        </div>
                    </div>
                }
            </div>

            {Tabla == null ?
                <SinContenido icon={"pi pi-user"} titulo={"No hay pagos registrados"} descripcion={"Comienza haciendo tu primer compra"} btnLabel={"Agregar estudiante"} /> :
                <TablaPersonaliza datos={Tabla} control={setTabla} recarga={init} />
            }
        </div>
    );
}
