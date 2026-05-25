import { Button } from "primereact/button";
import TituloAdmin from "../tituloAdmin";
import { useEffect, useRef, useState } from "react";
import CreadorFormularios from "../CreadorFormularios";
import global from "@/js/jsons/global";
import SinContenido from "../sinContendio";
import TablaPersonaliza from "../TablaPersonaliza";
import { Tag } from "primereact/tag";
import TableConfig from "@/js/clases/POOTabla";
import Modal from "../modal";
import { CargarArchivo } from "../CargaArchivo";
import { useGlobalStore } from "@/stores/itemStore";
import { cumplioEstructura, obtenerFecha, validarArchivo, validarEstructura, validarFormulario } from "@/js/scrips";
import { servicesPole } from "@/service/api";
import { Chip } from "primereact/chip";
import Image from "next/image";
const fNuevoProducto = [
    { id: "nombre", type: "text", title: "Producto", classDiv: "col col-12 col-md-8", placeholder: "Barra de pole 45mm", required: true, error: "El nombre es requerido" },
    { id: "estado", type: "select", title: "Estado", classDiv: "col col-12 col-md-4", options: [{ name: "Disponible", value: "disponible" }, { name: "Pausado", value: "pausado" }, { name: "Agotado", value: "agotado" }], optionValue: "value", optionLabel: "name", required: true },
    { id: "categoria", type: "chips", title: "Categoria", classDiv: "col col-12 col-md-12", placeholder: "Escribe tu categoria y presiona enter" },
    { id: "cantidad", type: "number", title: "Cantidad", classDiv: "col col-12 col-md-6", placeholder: "Cantidad de piezas", required: true, error: "La cantidad es requerido" },
    { id: "precioCompra", type: "number", title: "Precio de compra", classDiv: "col col-12 col-md-6", placeholder: "Precio de compra", required: true, error: "El precio de compra es requerido" },
    { id: "precio", type: "number", title: "Precio de venta", classDiv: "col col-12 col-md-6", placeholder: "Precio de venta", required: true, error: "El precio es requerido" },
    { id: "fechaCompra", type: "calendar", title: "Compra del producto", classDiv: "col col-6", required: true, error: "La fecha es requerida" },
    { id: "talla", type: "chips", title: "Talla", classDiv: "col col-12 col-md-12", placeholder: "Escribe la talla del producto" },
    { id: "color", type: "chips", title: "Color", classDiv: "col col-12 col-md-12", placeholder: "Escribe el color del producto" },
    { id: "descripcion", type: "textArea", title: "Descripción", classDiv: "col col-12", placeholder: "Descripción del producto", required: true, error: "La descripción es requerida" },
]
const templateRespuesta = { ...global.creadorProducto }
export default function Inventario() {
    // const [Tab, setTab] = useState({ labels: ["Horario semanal", "Lista de clases"], index: 0 });
    const [Tabla, setTabla] = useState(null)
    const [Formulario, setFormulario] = useState(templateRespuesta)
    const [ModalC, setModalC] = useState({ activar: false, header: "Crear producto", style: { width: "50%", margin: "auto" }, class: "bg-admin modal-container" })
    const [Archivo, setArchivo] = useState([]);
    const { addData } = useGlobalStore();
    const cargaArchivoRef = useRef(null);
    const accionesServicio = async (tipo, datos) => {
        let res = {}
        const formData = new FormData();
        Object.entries(datos).forEach(([key, value]) => {
            if (key !== "categoria" && key !== "color" && key !== "talla") {
                // console.log("43---" + key);
                formData.append(key, value);
            }
        });

        datos.categoria.forEach(cat => {
            formData.append("categoria", cat);
        });
        datos.color.forEach(cat => {
            formData.append("color", cat);
        });
        datos.talla.forEach(cat => {
            formData.append("talla", cat);
        });

        if (Formulario.actualizarI || tipo == "crear") {
            // console.log("45 cargar imagenes");
            Archivo.forEach(file => {
                formData.append("imagen", file);
            });
        }
        // ✅ imágenes (MULTIPLE)
        switch (tipo) {
            case "eliminar":
                res = await servicesPole.productos.eliminarProductos(Formulario._id)
                break;
            case "editar":
                // console.log("53", Formulario);
                res = await servicesPole.productos.editarProductos(Formulario._id, formData)
                break;
            case "crear":
                res = await servicesPole.productos.crearProductos(formData)
                // console.log("38", datos, Archivo);
                break;

            default:
                break;
        }
        return res
    }
    const acciones = async ({ tipo = "crear", template = templateRespuesta, formulario = fNuevoProducto, mensaje = "", validarArchivoCondicion = true } = {}) => {
        addData("load", { activo: true, mensaje: "Cargando..." })
        let res = validarEstructura(template, Formulario)
        let validacionFormulario = validarFormulario(formulario, Formulario)
        let valArc = validarArchivo({ archivos: Archivo, extensiones: ["png", "jpg", "webp", "jpeg"] })
        let valCon
        if (validarArchivoCondicion) {
            valCon = valArc.valido && Archivo.length > 0
        } else {
            valCon = true
        }
        // console.log("68", );
        if (valCon) {
            if (cumplioEstructura(res) && validacionFormulario.length == 0) {
                try {
                    await accionesServicio(tipo, res.value)
                    addData("load", { activo: false, mensaje: "Cargando..." })
                    addData("notificacion", { severity: 'success', summary: 'Acción completada', detail: mensaje, life: 3000 })
                    setModalC({ ...ModalC, activar: false, tipo: "crear" })
                    setFormulario(templateRespuesta)
                    setArchivo([])
                    Tabla.getConfig().selectedRows.length = 0
                    crearTabla()
                } catch (error) {
                    addData("load", { activo: false, mensaje: "Cargando..." })
                    console.log(error);
                    addData("notificacion", { severity: 'error', summary: 'Hubo un problema', detail: 'Usuario o contraseña incorrectos', life: 3000 })
                }
            } else {
                addData("load", { activo: false, mensaje: "Cargando..." })
                console.log();
                addData("notificacion", { severity: 'error', summary: 'Hubo un problema', detail: validacionFormulario[0]?.mensaje, life: 3000 })
            }
        } else {
            addData("load", { activo: false, mensaje: "Cargando..." })
            // console.log();
            if (Archivo.length == 0) {
                addData("notificacion", { severity: 'error', summary: 'Hubo un problema', detail: "El archivo es requerido", life: 3000 })
            } else {
                addData("notificacion", { severity: 'error', summary: 'Hubo un problema', detail: "El archivo: " + valArc.invalidos[0].name + " no es valido", life: 3000 })
            }
        }
    }
    const crearTabla = async () => {
        let listaProductos = await servicesPole.productos.consultarProductos()
        // console.log(listaProductos.data);
        const tbl = new TableConfig()
        tbl.addCol("_id", "ID", true, false, { type: 'text', style: { display: 'none' } })
        tbl.addCol("estado", "Estado", true, false, {
            type: 'text',
            body: (rowData) => (
                <div className="" >
                    <Tag severity={rowData.estado == "disponible" ? "success" : rowData.estado == "agotado" ? "danger" : "warning"} value={rowData.estado} />
                </div>
            )
        }, false, "max-content")
        tbl.addCol("nombre", "Nombre", true, false)
        tbl.addCol("descripcion", "Descripción", true, false)
        tbl.addCol("cantidadInicial", "Cantidad", true, false)
        tbl.addCol("cantidad", "Stock", true, false)
        tbl.addCol("vendidos", "Vendidos", true, false)
        tbl.addCol("precio", "Precio", true, false)
        tbl.addCol("precioCompra", "Precio compra", true, false)
        tbl.addCol("categoria", "Categorias", true, false, {
            type: 'text',
            body: (rowData) => (
                <div className="" >
                    {rowData.categoria.map((e, i) => {
                        return (
                            <Chip className="bg-dual-claro fz-12 me-2" label={e} key={"tags" + i} />
                        )
                    })}
                </div>
            )
        }, false, "max-content")
        tbl.addData(listaProductos.data);
        tbl.addDataKey('productosTabla')
        setTabla(tbl)
    }
    const accionesGlobal = (tipo) => {
        switch (tipo) {
            case "eliminarProducto":
                acciones({ tipo: "eliminar", mensaje: "Producto eliminado", validarArchivoCondicion: false })
                break;
            case "editarProducto":
                acciones({ tipo: "editar", mensaje: "Producto actualizado", validarArchivoCondicion: Formulario?.actualizarI ? true : false })
                break;
            case "crearProducto":
                acciones({ tipo: "crear", mensaje: "Producto creado" })
                break;
            default:
                break;
        }
    }
    useEffect(() => {
        let seleccionado = Tabla?.getConfig()?.selectedRows
        if (Tabla && seleccionado.length == 1) {
            if (typeof seleccionado[0].fechaCompra == "string") {
                seleccionado[0].fechaCompra = obtenerFecha({ date: seleccionado?.[0]?.fechaCompra?.split("T")[0], format: true, separador: "-" }).format
            }
            // console.log(seleccionado[0]);
            setFormulario(seleccionado[0])
            setModalC({ ...ModalC, activar: true, tipo: "editar", data: seleccionado[0] })
            // setSeleccionados(Tabla.getConfig().selectedRows)
        }
    }, [Tabla]);
    useEffect(() => {
        crearTabla()
    }, [])
    return (
        <div>
            <Modal data={ModalC} control={setModalC}>
                {!Formulario?.actualizarI && ModalC.tipo == "editar" ?
                    <div className="m-auto mb-4 text-center">
                        <div className="d-flex">
                            {Formulario?.imagen?.map((e, i) => {
                                return (
                                    <div className="m-auto" style={{ height: "100px", width: "100px", position: "relative" }} key={"imagenes" + i}>
                                        <Image src={e} alt="Producto" fill style={{ objectFit: "cover" }} />
                                    </div>
                                )
                            })}
                        </div>
                        <Button label="Actulizar imagen" className="br-15 mt-3 ms-auto" severity="secondary" text raised onClick={() => setFormulario({ ...Formulario, actualizarI: !Formulario.actualizarI })} />
                    </div> :
                    <div>
                        <CargarArchivo ref={cargaArchivoRef} datos={Archivo} control={setArchivo} />
                        <small>Formatos validos: png, jpg, webp, jpeg</small>
                        <p className="text-dual">La categoria fisica es para productos en clase y linea para venta desde el sistema</p>
                        {ModalC.tipo == "editar" &&
                            <Button label="Mantener imagen" className="br-15 m-auto" severity="secondary" text raised onClick={() => setFormulario({ ...Formulario, actualizarI: !Formulario.actualizarI })} />
                        }
                    </div>
                }
                <div className="mb-5">
                    <CreadorFormularios
                        key="formulario-producto"
                        campos={fNuevoProducto}
                        datos={Formulario}
                        control={setFormulario}
                    />
                </div>
                <div className="acciones-modal d-flex text-end">
                    <Button label="Cancelar" className="br-15 me-2 ms-auto" severity="secondary" text raised onClick={() => { setModalC({ ...ModalC, activar: false, tipo: "crear" }), Tabla.getConfig().selectedRows.length = 0 }} />
                    {ModalC.tipo == "editar" &&
                        <Button label={"Eliminar"} className="btn btn-dual br-15 me-2" onClick={() => accionesGlobal("eliminarProducto")} />
                    }
                    <Button label={ModalC.tipo == "editar" ? "Editar" : "Crear"} className="btn btn-dual br-15" onClick={() => ModalC.tipo == "editar" ? accionesGlobal("editarProducto") : accionesGlobal("crearProducto")} />
                </div>
            </Modal>
            <div className="row">
                <div className="col col-12 col-md-7">
                    <TituloAdmin titulo={"Inventario"} descripcion={"Gestiona equipamiento y productos"} />
                </div>
                <div className="col col-12 col-md-5 text-end d-flex align-items-center">
                    <div className="ms-auto">
                        <Button icon="pi pi-plus" label="Agregar producto" className="ms-auto btn-dual br-15 me-3" onClick={() => setModalC({ ...ModalC, activar: true, tipo: "plan" })} />
                    </div>
                </div>
            </div>
            <div>
                {global.productos.length == 0 ?
                    <SinContenido icon={"pi pi-box"} titulo={"No hay producto"} descripcion={"Comienza agregando tu primer producto"} btnLabel={"Agregar producto"} /> :
                    <TablaPersonaliza
                        datos={Tabla}
                        control={setTabla}
                        recarga={crearTabla}
                    />
                }
            </div>
        </div>
    )
}