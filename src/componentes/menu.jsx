"use client";

import Link from 'next/link';
import { Menubar } from 'primereact/menubar';
import { useEffect } from 'react';

export default function Menu() {
    useEffect(() => {
        const handleScroll = () => {
            const elemento = document.getElementById("navHeader");

            if (!elemento) return;

            if (window.scrollY > 80) {
                elemento.classList.remove("bg-transparent");
                elemento.classList.add("glass", "shadow-md");
            } else {
                elemento.classList.remove("glass", "shadow-md");
                elemento.classList.add("bg-transparent");
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (!el) return;

        const yOffset = -80; // altura del menú
        const y =
            el.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: "smooth" });
    };

    const items = [
        { label: 'Inicio', command: () => scrollTo("inicio") },
        { label: 'Disiplinas', command: () => scrollTo("clases") },
        { label: 'Nosotros', command: () => scrollTo("planes") },
        { label: 'Horarios', command: () => scrollTo("horarios") },
        // { label: 'Testimonios', command: () => scrollTo("horarios") },
        { label: 'Contactanos', command: () => scrollTo("contactanos") }
    ];

    const start = (
        <img
            src="/logo.jpg"
            alt="Logo"
            height="40"
            style={{ borderRadius: '50%' }}
        />
    );
    const end = (
        <div className='d-flex'>
            <div className='me-3'>
                <Link href='/' onClick={() =>
                    window.open(
                        "https://wa.me/5215512345678?text=Hola%20quiero%20información",
                        "_blank"
                    )
                } className='btn-s btn-dual'>
                    {/* <span className='pi pi-shop me-2'></span>  */}
                    Reserva tu clase</Link>
            </div>
            <div className='me-3'>
                <Link href='/tienda' className='p-menuitem-content'>
                    {/* <span className='pi pi-shop me-2'></span>  */}
                    Tienda</Link>
            </div>
            <div className=''>
                <Link href='/acceso' className='p-menuitem-content'>
                    {/* <span className='pi pi-user me-2'></span> */}
                    <span>Iniciar sesion</span>
                </Link>
            </div>
        </div>
    )

    return (
        <div className="sticky-top fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent" style={{ height: "80px" }} id="navHeader">
            <Menubar model={items} start={start} end={end} />
        </div>
    );
}
