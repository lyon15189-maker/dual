"use client";
import { Button } from "primereact/button";


export default function BannerTienda(params) {
    return (
        <div className="banner-principal banner-principal-image2 container-fluid p-0 " id="inicio">
            <div className="vh-100 centrar text-start w-50 m-auto">
                <div className="d-grid container">
                    <p className="link-tienda text-dual" id="inicio">DUAL POLE & AERIAL STUDIO</p>
                    <div className="titulo-banner mt-4">
                        <strong className="fz-60 mb-0 text-white">Eleva tu</strong><br />
                        <strong className="fz-60 text-dual">Práctica</strong>
                    </div>
                    <div className="mt-4">
                        <p className="text-white">En DUAL Pole & Aerial Studio combinamos arte, fuerza y elegancia. Únete a nuestra comunidad y transforma tu cuerpo mientras expresas tu creatividad.</p>
                    </div>
                    <div className="mt-4">
                        <Button className="btn-s btn-dual me-3" label="EXPLORAR CATÁLOGO" icon="pi pi-angle-right" iconPos="right"/>
                        <Button className="btn-s btn-transparent" label="VER EQUIPAMENTO" icon="pi pi-angle-right" iconPos="right"/>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}