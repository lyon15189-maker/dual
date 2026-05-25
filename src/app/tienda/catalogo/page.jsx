"use client";
import ConfigurarArticulo from "@/componentes/configurarArticulo";
import { FooterTienda } from "@/componentes/footerTienda";
import Menu2 from "@/componentes/menu2";
import ListaProductos from "@/componentes/productos";
import { buscador, PrimeraMayuscula } from "@/js/scrips";
import { servicesPole } from "@/service/api";
import { useGlobalStore } from "@/stores/itemStore";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { Tag } from "primereact/tag";
import { useEffect, useState } from "react";

const productos1 = [
    {
        id: '1000',
        code: 'f230fh0g3',
        name: 'Conjunto 1',
        description: 'Product Description',
        image: '/productos/p1.jpg',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        link: "/tienda/producto/1",
        rating: 5
    },
    {
        id: '1001',
        code: 'f230fh0g31',
        name: 'Conjunto 2',
        description: 'Product Description1',
        image: '/productos/p2.jpg',
        price: 72,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        link: "/tienda/producto/2",
        rating: 5
    },
    {
        id: '1002',
        code: 'f230fh0g32',
        name: 'Conjunto 3',
        description: 'Product Description2',
        image: '/productos/p3.jpg',
        price: 79,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'LOWSTOCK',
        link: "/tienda/producto/3",
        rating: 5
    },
    {
        id: '1000',
        code: 'f230fh0g3',
        name: 'Conjunto 4',
        description: 'Product Description',
        image: '/productos/p4.jpg',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        link: "/tienda/producto/4",
        rating: 5
    },
    {
        id: '1001',
        code: 'f230fh0g31',
        name: 'Conjunto 5',
        description: 'Product Description1',
        image: '/productos/p5.jpg',
        price: 72,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        link: "/tienda/producto/5",
        rating: 5
    },
    {
        id: '1002',
        code: 'f230fh0g32',
        name: 'Conjunto 6',
        description: 'Product Description2',
        image: '/productos/p6.jpg',
        price: 79,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'LOWSTOCK',
        link: "/tienda/producto/6",
        rating: 5
    },
]
const productos2 = [
    {
        id: '1000',
        code: 'f230fh0g3',
        name: 'Conjunto 7',
        description: 'Product Description',
        image: '/productos/p7.jpg',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        link: "/tienda/producto/7",
        rating: 5
    },
    {
        id: '1001',
        code: 'f230fh0g31',
        name: 'Conjunto 8',
        description: 'Product Description1',
        image: '/productos/p8.jpg',
        price: 72,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        link: "/tienda/producto/8",
        rating: 5
    },
    {
        id: '1002',
        code: 'f230fh0g32',
        name: 'Conjunto 9',
        description: 'Product Description2',
        image: '/productos/p9.jpg',
        price: 79,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'LOWSTOCK',
        link: "/tienda/producto/9",
        rating: 5
    },
    {
        id: '1000',
        code: 'f230fh0g3',
        name: 'Conjunto 10',
        description: 'Product Description',
        image: '/productos/p10.jpg',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        link: "/tienda/producto/10",
        rating: 5
    },
    {
        id: '1001',
        code: 'f230fh0g31',
        name: 'Conjunto 11',
        description: 'Product Description1',
        image: '/productos/p11.jpg',
        price: 72,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        link: "/tienda/producto/11",
        rating: 5
    },
    {
        id: '1002',
        code: 'f230fh0g32',
        name: 'Conjunto 12',
        description: 'Product Description2',
        image: '/productos/p12.jpg',
        price: 79,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'LOWSTOCK',
        link: "/tienda/producto/12",
        rating: 5
    },
]
const productos3 = [
    {
        id: '1000',
        code: 'f230fh0g3',
        name: 'Conjunto 13',
        description: 'Product Description',
        image: '/productos/p13.jpg',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        link: "/tienda/producto/13",
        rating: 5
    },
    {
        id: '1001',
        code: 'f230fh0g31',
        name: 'Conjunto 14',
        description: 'Product Description1',
        image: '/productos/p14.jpg',
        price: 72,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        link: "/tienda/producto/14",
        rating: 5
    },
    {
        id: '1002',
        code: 'f230fh0g32',
        name: 'Conjunto 15',
        description: 'Product Description2',
        image: '/productos/p15.jpg',
        price: 79,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'LOWSTOCK',
        link: "/tienda/producto/15",
        rating: 5
    },
    {
        id: '1000',
        code: 'f230fh0g3',
        name: 'Conjunto 16',
        description: 'Product Description',
        image: '/productos/p1.jpg',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        link: "/tienda/producto/16",
        rating: 5
    },
    {
        id: '1001',
        code: 'f230fh0g31',
        name: 'Conjunto 17',
        description: 'Product Description1',
        image: '/productos/p3.jpg',
        price: 72,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        link: "/tienda/producto/17",
        rating: 5
    },
    {
        id: '1002',
        code: 'f230fh0g32',
        name: 'Conjunto 18',
        description: 'Product Description2',
        image: '/productos/p5.jpg',
        price: 79,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'LOWSTOCK',
        link: "/tienda/producto/18",
        rating: 5
    },
]
// const filtros = ["TODOS", "ROPA DEPORTIVA", "ACCESORIOS", "EQUIPAMENTO", "YOGA & WELLNESS"]
export default function Catalogo(params) {
    const [products, setProducts] = useState({});
    const [Busqueda, setBusqueda] = useState([]);
    const [Valor, setValor] = useState("");
    const [Filtros, setFiltros] = useState([]);
    const router = useRouter();
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
    const cargarArticulos = async () => {
        try {
            let listaArticulos = await servicesPole.productos.consultarProductosTienda()
            // console.log("97", listaArticulos.data);
            setFiltros(["Todos"].concat(obtenerCategoriasUnicas(listaArticulos.data)))
            setBusqueda(listaArticulos.data)
            setProducts(listaArticulos.data)
        } catch (error) {
            // console.error("99:", error);
        }
    }
    const seleccionarProducto = (obj) => {
        // console.log(obj);
        addData("prodcutoTienda", obj)
        router.push("/tienda/producto/" + obj._id)
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
        <div className="bg-negro">
            <div className="container">

                <div className="pb-5">
                    <Menu2 />
                </div>
                <div className="col col-6 pt-5">
                    <div className="text-dual" id="destacados">TIENDA</div>
                    <h2 className="titulo-tienda text-white">Todos los Productos</h2>
                </div>
                <div className="row">
                    <div className="col col-2 centrar">
                        <span className="text-white mt-2">{Busqueda.length + " productos"}</span>
                    </div>
                    <div className="col col-10 text-end">
                        <ConfigurarArticulo data={Filtros} control={setValor} />
                    </div>
                    <div className="mt-4 container mb-4">
                        {/* <ListaProductos data={Busqueda} /> */}
                        <div className="row">
                            {Busqueda.map((e, i) => {
                                return (
                                    <div key={"productos" + i} className="col col-12 col-md-3">
                                        <div className="producto-tienda border-round bg-dark pointer" onClick={() => seleccionarProducto(e)}>
                                            <div className="mb-3 text-center">
                                                <div className='producto-tienda-imagen'>
                                                    <Image src={`${e?.imagen?.[0]}`} alt={e.nombre} width={"100%"} height='100%' />
                                                </div>
                                            </div>
                                            <div className='w-75 m-auto mb-4'>
                                                <p className="text-dual m-0">
                                                    {e?.categoria?.map((e, i) => {
                                                        return (
                                                            <Tag key={"cat" + i} value={PrimeraMayuscula(e)} rounded className="bg-dual me-2" />
                                                        )
                                                    })}
                                                </p>
                                                <h4 className="text-white titulo-tienda-eo">{e.nombre}</h4>
                                                <h6 className="text-white">${e.precio}</h6>
                                                {/* <small><del>Antes ${product.price + 150}</del></small>
                                                    <strong className='text-white'>En tres pagos a ${product.price + 100}</strong> */}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        {/* <ListaProductos data={productos2} />
                        <ListaProductos data={productos3} /> */}

                    </div>
                </div>
            </div>
            <FooterTienda />
        </div>
    )
}