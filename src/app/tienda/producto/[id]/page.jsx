"use client";
import Carrusel from "@/componentes/carrusel";
import ConfigurarArticulo from "@/componentes/configurarArticulo";
import { FooterTienda } from "@/componentes/footerTienda";
import Menu2 from "@/componentes/menu2";
import { PrimeraMayuscula } from "@/js/scrips";
import { servicesPole } from "@/service/api";
import { useGlobalStore } from "@/stores/itemStore";
import Link from "next/link";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { InputNumber } from "primereact/inputnumber";
import { Tag } from "primereact/tag";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";


export default function producto() {
    const { data, addData } = useGlobalStore();
    const { prodcutoTienda } = data
    const [producto, setProducto] = useState(prodcutoTienda)
    const [Talla, setTalla] = useState("")
    const [Color, setColor] = useState("")
    const icon = (<i className="pi pi-eye"></i>)
    const [value2, setValue2] = useState(1);
    const params = useParams();
    const router = useRouter()

    const agregarCarrito = async () => {
        let usuario = localStorage.getItem("usuario")
        // console.log(usuario);
        if (usuario == null) {
            router.push("/sesion")
        } else {
            try {
                let obj = {}
                obj.productoId = producto._id
                obj.cantidad = value2
                obj.talla = Talla
                obj.color = Color
                // addData("mod", { activar: true })
                await servicesPole.carrito.crearCarrito(obj)
                // console.log("34", car);
                addData("notificacion", { severity: 'success', summary: 'Accion exitosa', detail: "El producto se añadio al carrito", life: 3000 })
                // consultarCarrito()
            } catch (error) {
                console.log("47", error);
            }
        }
    }
    // const consultarCarrito = async () => {
    //     try {
    //         let consultarCarrito = await servicesPole.carrito.consultarCarrito()
    //         // console.log("44", consultarCarrito);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    const consultarProducto = async () => {
        addData("load", { activo: true, mensaje: "Cargando..." })
        try {
            let consultarProducto = await servicesPole.productos.consultarUnProducto(params.id)
            setTalla(consultarProducto.data.talla[0])
            setColor(consultarProducto.data.color[0])
            setProducto(consultarProducto.data)
            addData("load", { activo: false, mensaje: "Cargando..." })
            // console.log("44", consultarProducto);
        } catch (error) {
            console.log(error);
            addData("load", { activo: false, mensaje: "Cargando..." })
        }
    }
    useEffect(() => {
        consultarProducto()
    }, [])

    return (
        <div className="container-fluid p-0 bg-negro">
            <div className="pb-5">
                <Menu2 />
            </div>
            <div className="container pt-5">
                <Link href='/tienda/catalogo' className='p-menuitem-content text-white'><span className="pi pi-arrow-left me-2"></span>Volver</Link>
                <div className="row">
                    <div className="col col-12 col-md-5">
                        <div className="m-4 text-center card">
                            {producto?.image && <Image className="ms-auto me-auto w-100" src={producto?.image} height={300} alt={producto?.name} indicatorIcon={icon} preview />}
                            {producto?.imagen && <Carrusel imagenes={producto?.imagen} />}

                        </div>
                    </div>
                    <div className="col col-12 col-md-7">
                        <div className="">
                            <div className="text-dual m-0">
                                {producto?.categoria?.map((e, i) => {
                                    return (
                                        <Tag key={"cat" + i} value={PrimeraMayuscula(e)} rounded className="bg-dual-2 me-2" />
                                    )
                                })}
                            </div>
                            <p className="titulo-tienda text-white m-0"><strong>{producto?.nombre}</strong></p>
                            <p className="fz-30 text-white"><strong>${producto?.precio}</strong></p>
                            <p className="text-gray-2">{producto?.descripcion}</p>
                            <p className="text-gray-2 mt-3"><strong>Stock:</strong>{producto?.cantidad}</p>
                            <p className="text-dual m-0">TALLA</p>
                            <ConfigurarArticulo data={producto?.talla} control={setTalla} />
                            <p className="text-dual m-0 mt-2">COLOR</p>
                            <ConfigurarArticulo data={producto?.color} control={setColor} />
                            <div className="flex-auto mt-2" style={{ display: "table-caption" }}>
                                <label htmlFor="horizontal-buttons" className="text-dual">Cantidad:</label>
                                <InputNumber
                                    style={{ width: "160px" }}
                                    className=""
                                    inputId="horizontal-buttons"
                                    value={value2}
                                    onValueChange={(e) => setValue2(e.value)}
                                    showButtons
                                    buttonLayout="horizontal"
                                    min={1}
                                    max={producto?.cantidad}
                                    decrementButtonClassName="bg-dual-2"
                                    incrementButtonClassName="bg-dual-2"
                                    incrementButtonIcon="pi pi-plus"
                                    decrementButtonIcon="pi pi-minus"
                                />
                            </div>
                            <Button className="btn-dual mt-3 br-15" label="Agregar al carrito" icon="pi pi-shopping-cart" onClick={() => agregarCarrito()} />
                            {/* <div className="clase-lista br-25">
                                N° de cuenta
                            </div>
                            <div className="">
                                1452456324521452
                            </div> */}
                            {/* <hr /> */}

                        </div>
                    </div>
                </div>
            </div>
            <FooterTienda />
        </div>
    )
}