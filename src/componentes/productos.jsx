"use client";
import React, { useState, useEffect } from 'react';
import { Carousel } from 'primereact/carousel';
import { useGlobalStore } from "@/stores/itemStore";
import { useRouter } from "next/navigation";
import { Image } from 'primereact/image';
import { Tag } from 'primereact/tag';
import { PrimeraMayuscula } from '@/js/scrips';


export default function ListaProductos({ data }) {
    const { addData } = useGlobalStore();
    // const [products, setProducts] = useState(data);
    // console.log("12",data);
    const router = useRouter();
    const responsiveOptions = [
        {
            breakpoint: '1400px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '1199px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '575px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    
    const seleccionarProducto = (obj) => {
        // console.log(obj);
        addData("prodcutoTienda", obj)
        router.push("/tienda/producto/"+obj._id)
    }
    const productTemplate = (product) => {
        // console.log("producto 52", product);

        return (
            // <Link href={product.link}>
            <div className="producto-tienda border-round bg-dark pointer" onClick={() => seleccionarProducto(product)}>
                <div className="mb-3 text-center">
                    <div className='producto-tienda-imagen'>
                        <Image src={`${product?.imagen?.[0]}`} alt={product.nombre} width={"100%"} height='100%' />
                    </div>
                </div>
                <div className='w-75 m-auto mb-4'>
                    <p className="text-dual m-0">
                        {product?.categoria?.map((e, i) => {
                            return (
                                <Tag key={"cat"+i} value={PrimeraMayuscula(e)} rounded className="bg-dual me-2" />
                            )
                        })}
                    </p>
                    <h4 className="text-white titulo-tienda-producto">{product.nombre}</h4>
                    <h6 className="text-white">${product.precio}</h6>
                    {/* <small><del>Antes ${product.price + 150}</del></small>
                    <strong className='text-white'>En tres pagos a ${product.price + 100}</strong> */}
                </div>
            </div>
            // </Link}>
        );
    };

    return (
        <div className="w-full">
            <Carousel value={data} numScroll={1} numVisible={4} responsiveOptions={responsiveOptions} itemTemplate={productTemplate} circular />
        </div>
    )
}