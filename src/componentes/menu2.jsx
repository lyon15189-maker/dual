"use client";

import Link from 'next/link';
import { Menubar } from 'primereact/menubar';
import { useEffect, useState } from 'react';
import Carrito from './admin/carrito';
import { useGlobalStore } from '@/stores/itemStore';
import { useRouter } from 'next/navigation';
import Notificacion from './notificacion';
import Modal from './modal';
import { Avatar } from 'primereact/avatar';
const modalDefecto = { activar: false, style: { width: "50%", margin: "auto" } }
export default function Menu2() {
    const [ModalC, setModalC] = useState(modalDefecto)
    const [Usuario, setUsuario] = useState(null)
    const { data, addData } = useGlobalStore();
    // console.log(data);

    const router = useRouter()
    useEffect(() => {
        const handleScroll = () => {
            const elemento = document.getElementById("navHeader");

            if (!elemento) return;

            if (window.scrollY > 80) {
                elemento.classList.remove("bg-transparent");
                elemento.classList.add("shadow-md");
            } else {
                elemento.classList.remove("shadow-md", "glass");
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
        { label: 'Inicio', url: '/tienda', command: () => scrollTo("inicio") },
        { label: 'Colecciones', url: '/tienda', command: () => scrollTo("colecciones") },
        { label: 'Destacados', url: '/tienda', command: () => scrollTo("destacados") },
        { label: 'Comunidad', url: '/tienda', command: () => scrollTo("comunidad") },
        { label: 'Catalogo', url: '/tienda/catalogo' },
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
                <Link href='/' className='p-menuitem-content'>
                    Estudio
                </Link>
            </div>
            {Usuario !== null &&
                <div className='me-3'>
                    <span className='pi pi-shopping-cart pointer' onClick={() => setModalC({ ...ModalC, activar: true })}></span>
                </div>
            }
            <div className=''>
                {Usuario !== null ?
                    Usuario.avatar !== "" ?
                        <img
                            onClick={() => router.push("/sesion")}
                            src={Usuario.avatar}
                            alt="avatar"
                            className="icon-admin rounded-circle pointer"
                            style={{
                                width: "25px",
                                height: "25px",
                                objectFit: "cover"
                            }}
                        /> :
                        <Avatar shape="circle" icon="pi pi-user"
                            onClick={() => router.push("/sesion")}
                            style={{
                                width: "25px",
                                height: "25px",
                                objectFit: "cover"
                            }}
                        /> :
                    <Link href='/acceso' className='p-menuitem-content'>
                        <span>Iniciar sesion</span>
                    </Link>
                }
            </div>
        </div>
    )
    useEffect(() => {
        // console.log("99", data);
        if (data?.mod !== undefined) {
            setModalC({ ...ModalC, activar: false })
            addData("mod", true)
        }
    }, [data?.mod])
    useEffect(() => {
        let usuario = localStorage.getItem("usuario")
        setUsuario(JSON.parse(usuario))
        addData("notificacion", {})
        // console.log("96", JSON.parse(usuario));
    }, [])
    return (
        <div className="sticky-top fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent" style={{ height: "80px" }} id="navHeader">
            <Menubar model={items} start={start} end={end} className='msk-black' />
            <Modal data={ModalC} control={setModalC}>
                <Carrito />
            </Modal>
            {data.notificacion !== undefined &&
                Object?.keys(data?.notificacion)?.length > 0 &&
                <Notificacion mensaje={data.notificacion} />

            }

        </div>
    );
}
