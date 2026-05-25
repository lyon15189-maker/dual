import { Divider } from "primereact/divider";
import TituloAdmin from "../tituloAdmin";
import { Button } from "primereact/button";
import CreadorFormularios from "../CreadorFormularios";
import { useEffect, useState } from "react";
import Carrito from "./carrito";
import Modal from "../modal";
import { servicesPole } from "@/service/api";
import { Image } from "primereact/image";
import { Tag } from "primereact/tag";
import { buscador, PrimeraMayuscula } from "@/js/scrips";
import ConfigurarArticulo from "../configurarArticulo";
import { InputNumber } from "primereact/inputnumber";
import { useGlobalStore } from "@/stores/itemStore";

export default function Tienda() {
    const [ModalC, setModalC] = useState({});
    const [products, setProducts] = useState([]);
    const [Filtros, setFiltros] = useState([]);
    const [Busqueda, setBusqueda] = useState([]);
    const [Valor, setValor] = useState([]);
    const [Value, setValue] = useState({});
    const { addData } = useGlobalStore();

    function obtenerCategoriasUnicas(lista) {
        const categorias = new Set();

        lista.forEach(item => {
            if (Array.isArray(item.categoria)) {
                item.categoria.forEach(cat => categorias.add(cat));
            }
        });

        return [...categorias];
    }
    const agregarCarrito = async (obj) => {
        try {
            let objs = {}
            objs.productoId = obj._id
            objs.cantidad = Value[obj._id]
            // console.log("34", objs);
            // addData("mod", { activar: true })
            await servicesPole.carrito.crearCarrito(objs)
            addData("notificacion", { severity: 'success', summary: 'Accion exitosa', detail: "El producto se añadio al carrito", life: 3000 })
            cargarArticulos()
        } catch (error) {
            console.log("47", error);
        }

    }
    const cargarArticulos = async () => {
        try {
            let listaArticulos = await servicesPole.productos.consultarProductosTienda("fisico")
            setFiltros(["Todos"].concat(obtenerCategoriasUnicas(listaArticulos.data)))
            // let listaArticulos = await servicesPole.productos.consultarProductosTienda()
            setProducts(listaArticulos.data)
            setBusqueda(listaArticulos.data)
            // console.log("97", listaArticulos.data);
        } catch (error) {
            console.error("99:", error);
        }
    }
    useEffect(() => {
        if (Object.keys(products).length > 0) {
            if (Valor == "Todos") {
                setBusqueda(buscador(products, ""))
            } else {
                setBusqueda(buscador(products, Valor))
            }
        }
    }, [Valor])
    useEffect(() => {
        cargarArticulos()
    }, [])
    return (
        <div className="Container-fluid">
            <Modal data={ModalC} control={setModalC}>
                <Carrito />
            </Modal>
            <div className="row">
                <div className="col col-6">
                    <TituloAdmin titulo={"Tienda"} descripcion={"Compra tus productos de la tiendita"} />
                </div>
                <div className="col col-6 text-end">
                    <Button icon="pi pi-shop" label="Carrito" className="ms-2 mt-2 btn-dual br-15 me-3" onClick={() => setModalC({ ...ModalC, activar: true, tipo: "crear" })} />
                </div>
            </div>
            <div className="container">
                <ConfigurarArticulo data={Filtros} control={setValor} />
                <div className="row">
                    {Busqueda.map((e, i) => {
                        return (
                            <div className="col col-12 col-md-4 " key={"productos-" + i}>
                                <div className="w-75 m-auto border-round bg-dark pointer">
                                    <div className="mb-3 text-center">
                                        <div className='producto-tienda-imagen w-100'>
                                            <Image src={`${e?.imagen?.[0]}`} alt={e.nombre} width={"100%"} height='100%' />
                                        </div>
                                    </div>
                                    <div className='w-75 m-auto mb-4'>
                                        <p className="text-dual m-0 text-center">
                                            {e?.categoria?.map((e, i) => {
                                                return (
                                                    <Tag key={"cat" + i} value={PrimeraMayuscula(e)} rounded className="bg-dual me-2" />
                                                )
                                            })}
                                        </p>
                                        <h4 className="text-white titulo-tienda-producto text-center">{e.nombre}</h4>
                                        <h6 className="text-white text-center">${e.precio}</h6>
                                        <h6 className="text-white fz-10 text-center">Stock: {e.cantidad}</h6>
                                        <div className="row">
                                            <div className="col col-12 col-md-12">
                                                <InputNumber
                                                    style={{ width: "100%" }}
                                                    className=""
                                                    inputId="horizontal-buttons"
                                                    value={Value[e._id]}
                                                    onValueChange={(z) => setValue({ ...Value, [e._id]: z.value })}
                                                    showButtons
                                                    defaultValue={1}
                                                    buttonLayout="horizontal"
                                                    min={1}
                                                    max={e?.cantidad}
                                                    decrementButtonClassName="bg-dual-2"
                                                    incrementButtonClassName="bg-dual-2"
                                                    incrementButtonIcon="pi pi-plus"
                                                    decrementButtonIcon="pi pi-minus"
                                                />
                                            </div>
                                            <div className="col col-12 col-md-12 mb-3">
                                                <Button className="btn-dual mt-3 br-15 w-100" label="Agregar" icon="pi pi-cart-arrow-down" onClick={() => agregarCarrito(e)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>
        </div>
    )
}