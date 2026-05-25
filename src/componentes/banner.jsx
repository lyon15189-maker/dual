"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Button } from "primereact/button";

const Carrusel = dynamic(() => import("./carrusel"), {
    ssr: false
});
const imagenes = [
    {
        src: "/banner1.jpg",
        alt: "Banner principal",
        title: "Gran promoción"
    },
    {
        src: "/banner2.jpg",
        alt: "Estudio",
        title: "estudio"
    },
    {
        src: "/banner3.jpg",
        alt: "yoga",
        title: "Clases de yoga"
    },
    {
        src: "/banner4.jpg",
        alt: "yoga",
        title: "Clases de yoga"
    }
];

export default function Banner(params) {
    return (
        <div className="banner-principal banner-principal-image1 container-fluid p-0 " id="inicio">
            <div className="vh-100 centrar text-center w-50 m-auto">
                <div className="d-grid">
                    <div className="contenedor-1"><span className="pi pi-sparkles me-2"></span>Bienvenida a DUAL</div>
                    <div className="titulo-banner mt-4">
                        <strong className="fz-60 mb-0">Descubre tu</strong><br />
                        <strong className="fz-60 text-dual">Fuerza Interior</strong>
                    </div>
                    <div className="mt-4">
                        <p className="text-gray">En DUAL Pole & Aerial Studio combinamos arte, fuerza y elegancia. Únete a nuestra comunidad y transforma tu cuerpo mientras expresas tu creatividad.</p>
                    </div>
                    <div className="mt-4">
                        <Button className="btn-s btn-dual me-3" label="Reserva tu clase de prueba" icon="pi pi-angle-right" iconPos="right"/>
                        <Button className="btn-s btn-transparent" label="Ver Disiplinas" icon="pi pi-angle-right" iconPos="right"/>
                    </div>
                    <div className="row mt-4">
                        <div className="col col-12 col-md-4 d-grid text-center">
                            <strong className="fz-30 text-dual">7</strong>
                            <small className="text-gray">Disciplinas</small>
                        </div>
                        <div className="col col-12 col-md-4 d-grid text-center">
                            <strong className="fz-30 text-dual">500</strong>
                            <small className="text-gray">Alumnas felices</small>
                        </div>
                        <div className="col col-12 col-md-4 d-grid text-center">
                            <strong className="fz-30 text-dual">5</strong>
                            <small className="text-gray">Años de Experiencia</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}