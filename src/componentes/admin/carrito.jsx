"use client";

import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import axios from "axios";
import SinContenido from "../sinContendio";
import { useRouter } from "next/navigation";
import { servicesPole } from "@/service/api";
import { InputTextarea } from "primereact/inputtextarea";
import { validarFormulario } from "@/js/scrips";
import CreadorFormularios from "../CreadorFormularios";
import { useGlobalStore } from "@/stores/itemStore";

const formPago = [
    { id: "metodoPago", type: "select", title: "Metodo de pago", classDiv: "col col-12", options: [{ name: "Efectivo", value: "efectivo" }, { name: "Transferencia", value: "transferencia" }], optionLabel: "name", optionValue: "value", required: true, error: "El campo metodo de pago es requerido" },
]
export default function Carrito() {
    const [carrito, setCarrito] = useState(null);
    const [Formulario, setFormulario] = useState({});
    const router = useRouter();
    const { data, addData } = useGlobalStore();
    const cargarCarrito = async () => {
        try {
            let data = await servicesPole.carrito.consultarCarrito()
            // console.log("19", data.data);
            setCarrito(data.data);
        } catch (error) {
            console.log(error);
        }
    };
    const actualizarCantidad = async (productoId, cantidad) => {
        try {
            let obj = {
                productoId: productoId,
                cantidad: cantidad
            }
            await servicesPole.carrito.actualizarCantidadCarrito(obj)
            cargarCarrito();
        } catch (error) {
            console.log(error);
        }
    };
    const eliminarProducto = async (id) => {
        // console.log("38", id);
        try {
            await servicesPole.carrito.eliminarProducto(id)
            cargarCarrito();
        } catch (error) {
            console.log(error);
        }
    };
    const vaciarCarrito = async () => {
        try {
            await servicesPole.carrito.vaciarCarrito()
            cargarCarrito();
        } catch (error) {
            console.log(error);
        }
    };
    const generarPago = async () => {
        addData("load", { activo: true, mensaje: "Cargando..." });
        try {
            let validacionFormulario = validarFormulario(formPago, Formulario);
            if (validacionFormulario.length == 0) {
                const payload = {
                    usuario: carrito.usuario,
                    metodoPago: Formulario.metodoPago,
                    items: carrito.items.map(item => ({
                        tipo: "producto",
                        id: item.producto._id,
                        cantidad: item.cantidad,
                        talla: item.talla,
                        color: item.color
                    }))
                };
                // console.log("80", payload);

                let pag = await servicesPole.pagos.crearPagos(payload)
                addData("notificacion", { severity: 'success', summary: 'Acción exitosa', detail: pag?.message, life: 3000 });
                addData("mod", false)
                vaciarCarrito()
                cargarCarrito();
                addData("load", { activo: false, mensaje: "Cargando..." });
            } else {
                addData("load", { activo: false, mensaje: "Cargando..." });
                addData("notificacion", { severity: 'error', summary: 'Hubo un problema', detail: validacionFormulario[0]?.mensaje, life: 3000 });
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => { cargarCarrito(); }, []);
    return (
        <div className="container">
            {/* <div className="row">
                <div className="col-12">
                    <h2 className="mb-4">

                        Mi Carrito
                    </h2>
                </div>
            </div> */}
            <div className="row">
                <div className="col-lg-8">
                    {carrito?.items.length == 0 ?
                        <div className="card">
                            <div className="col col-12">
                                <SinContenido icon={"pi pi-shopping-cart"} titulo={"No hay productos seleccionados"} descripcion={"Agregando tu primer producto"} btnLabel={"Nuevo producto"}  />
                            </div>
                        </div> :
                        <div className="container-fluid">
                            {
                                carrito?.items?.map(
                                    (item, i) => (
                                        <Card
                                            key={i}
                                            className="mb-3"
                                        >
                                            <div className="row align-items-center">
                                                <div className="col-md-2">
                                                    <img
                                                        src={item.imagen} className="img-fluid rounded" alt="" />
                                                </div>
                                                <div className="col-md-4">
                                                    <h5>{item.nombre}
                                                    </h5>
                                                    <p>${item.precio}
                                                    </p>
                                                </div>
                                                <div className="col-md-2">
                                                    <InputNumber value={item.cantidad} min={1} onValueChange={(e) => actualizarCantidad(item.producto._id, e.value)} />
                                                </div>
                                                <div className="col-md-2">
                                                    <strong>${item.subtotal}
                                                    </strong>
                                                </div>
                                                <div className="col-md-1">
                                                    <Button icon="pi pi-trash" severity="danger" onClick={() => eliminarProducto(item._id)} />
                                                </div>
                                            </div>
                                        </Card>
                                    )
                                )
                            }
                            {/* <InputTextarea value={Value} onChange={(e) => setValue(e.target.value)} rows={5} cols={30} placeholder="Notas para añadir a la compra" /> */}
                        </div>
                    }

                </div>
                <div className="col-lg-4">
                    <Card>
                        <h4>Resumen</h4>
                        <Divider />
                        <div className="d-flex justify-content-between">
                            <span> Productos</span>
                            <span>{carrito?.totalProductos || 0}</span>
                        </div>
                        <div className="d-flex justify-content-between mt-3">
                            <span>Subtotal</span>
                            <strong>${carrito?.subtotal || 0}</strong>
                        </div>
                        <Divider />
                        {carrito?.items.length > 0 &&
                            <div>
                                <CreadorFormularios
                                    key="crear-pagos"
                                    campos={formPago}
                                    datos={Formulario}
                                    control={setFormulario}
                                />
                                <Button label="Proceder al pago" icon="pi pi-credit-card" className="w-100 mb-2" onClick={generarPago} />
                                <Button label="Vaciar carrito" severity="danger" outlined className="w-100" onClick={vaciarCarrito} />
                            </div>
                        }
                    </Card>
                </div>
            </div>
        </div>
    );
}