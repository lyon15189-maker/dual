"use client"
import BannerTienda from "@/componentes/bannerTienda";
import { Categorias } from "@/componentes/categorias";
import { FooterTienda } from "@/componentes/footerTienda";
import Menu2 from "@/componentes/menu2";
import ListaProductos from "@/componentes/productos";
import { servicesPole } from "@/service/api";
import Link from "next/link";
import { Button } from "primereact/button";
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
export default function Tienda(params) {
    const [products, setProducts] = useState({});
    const cargarArticulos = async () => {
        try {
            let listaArticulos = await servicesPole.productos.consultarProductosTienda("linea")
            // let listaArticulos = await servicesPole.productos.consultarProductosTienda()
            setProducts(listaArticulos.data)
            // console.log("97", listaArticulos.data);
        } catch (error) {
            console.error("99:", error);
        }
    }
    useEffect(() => {
        cargarArticulos()
    }, [])
    return (
        <div className="bg-dark">
            <Menu2 />
            <BannerTienda />
            <Categorias />
            <div className="container mt-5 pb-5 pt-5">
                <div className="row">
                    <div className="col col-6">
                        <div className="text-dual" id="destacados">Seleccion</div>
                        <h2 className="titulo-tienda text-white">Productos Destacados</h2>
                    </div>
                    <div className="col col-6 ">
                        <div className="text-dual text-end mt-4 pointer">Ver todo <span className="ms-2 pi pi-arrow-right"></span></div>
                    </div>
                </div>
                <div className="p-3">
                    <ListaProductos data={products} />
                </div>
            </div>
            <div className="bg-negro text-center pb-5 pt-5" id="comunidad">
                <div className="mt-5 mb-5">
                    <p className="titulo-tienda text-white">Únete a nuestra comunidad</p>
                    <p className="fz-18 text-gray">Descubre los mejores productos para tu práctica de pole dance, aerial y yoga.</p>
                    <Button className="btn-s btn-dual me-3" label="CREAR CUENTA" icon="pi pi-arrow-right" iconPos="right" />
                </div>
            </div>
            <FooterTienda />
        </div>
    )
}