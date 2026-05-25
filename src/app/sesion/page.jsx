"use client"
import Dashboar from '@/componentes/admin/dasboard';
import { Avatar } from 'primereact/avatar';
import { Image } from 'primereact/image';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import Estudiantes from '@/componentes/admin/estudiante';
import Clases from '@/componentes/admin/clases';
import Reservaciones from '@/componentes/admin/reservaciones';
import Asistencia from '@/componentes/admin/asistencia';
import Instructores from '@/componentes/admin/instructores';
import Pagos from '@/componentes/admin/pagos';
import Planes from '@/componentes/admin/planes';
import Reportes from '@/componentes/admin/reportes';
import Inventario from '@/componentes/admin/inventario';
import Configuracion from '@/componentes/admin/configuracion';
import Tienda from '@/componentes/admin/tienda';
import Carrito from '@/componentes/admin/carrito';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { useGlobalStore } from '@/stores/itemStore';
import { Toast } from 'primereact/toast';
import Notificacion from '@/componentes/notificacion';
import Loader from '@/componentes/loader';
import { cortarTexto } from '@/js/scrips';

const opciones = [
    { icon: "pi pi-objects-column", text: "Dashboar", component: Dashboar },
    { icon: "pi pi-users", text: "Estudiantes", component: Estudiantes },
    { icon: "pi pi-calendar", text: "Clases", component: Clases },
    { icon: "pi pi-calendar-plus", text: "Reservaciones", component: Reservaciones },
    { icon: "pi pi-list", text: "Asistencia", component: Asistencia },
    { icon: "pi pi-user-plus", text: "Instructores", component: Instructores },
    { icon: "pi pi-credit-card", text: "Pagos", component: Pagos },
    { icon: "pi pi-tag", text: "Planes", component: Planes },
    { icon: "pi pi-credit-card", text: "Reportes", component: Reportes },
    { icon: "pi pi-box", text: "Inventario", component: Inventario },
    { icon: "pi pi-shop", text: "Tienda", component: Tienda },
    { icon: "pi pi-cog", text: "Configuracion", component: Configuracion },
]
const opcionesMa = [
    { icon: "pi pi-users", text: "Estudiantes", component: Estudiantes },
    { icon: "pi pi-calendar-plus", text: "Reservaciones", component: Reservaciones },
    { icon: "pi pi-list", text: "Asistencia", component: Asistencia },
    { icon: "pi pi-credit-card", text: "Pagos", component: Pagos },
    { icon: "pi pi-cog", text: "Configuracion", component: Configuracion },
    { icon: "pi pi-shop", text: "Tienda", component: Tienda },
]
const opcionesAlCl = [
    { icon: "pi pi-calendar-plus", text: "Reservaciones", component: Reservaciones },
    { icon: "pi pi-credit-card", text: "Pagos", component: Pagos },
    { icon: "pi pi-cog", text: "Configuracion", component: Configuracion },
    { icon: "pi pi-shop", text: "Tienda", component: Tienda },
]
export default function Sesion() {
    const [activo, setActivo] = useState(0);
    const [visible, setVisible] = useState(false);
    const [Data, setData] = useState({});
    const router = useRouter()
    const { data, addData } = useGlobalStore();
    const [Vista, setVista] = useState("Dashboar")
    const [Menus, setMenus] = useState(opciones)
    const toastTopRight = useRef(null);
    // console.log(data);
    const [validado, setValidado] = useState(false);

    const contenido = () => {
        const vistaActual = Menus.find(o => o.text === Vista);

        return vistaActual ? <vistaActual.component /> : null;
    }
    const cerrarSesion = () => {
        localStorage.clear()
        router.push('/acceso')
    }
    useEffect(() => {
        // console.log("58", data?.vista);
        setVista(data?.vista?.vista)
        setActivo(data?.vista?.idx)
    }, [data.vista])
    useEffect(() => {
        if (localStorage.getItem("token") == null) {
            router.replace('/acceso'); // 👈 mejor que push
        } else {
            setValidado(true);
            let sesionUsuario = JSON.parse(localStorage.getItem("usuario"))
            setData(sesionUsuario);
            addData("sesion", sesionUsuario)
            // console.log("77", sesionUsuario);
            switch (sesionUsuario?.rol) {
                case "admin":
                    setMenus(opciones)
                    setVista("Dashboar")
                    break;
                case "maestro":
                    setMenus(opcionesMa)
                    setVista("Pagos")
                    setActivo(3)
                    break;
                default:
                    setMenus(opcionesAlCl)
                    setVista("Reservaciones")
                    setActivo(0)
                    break;
            }
        }
    }, [router]);
    // ✅ TOAST (seguro)
    useEffect(() => {
        if (data?.alert && toastTopRight.current) {
            toastTopRight.current.show(data.alert);
        }
    }, [data?.alert]);
    // 👇 BLOQUEA render hasta validar
    if (!validado) return null;
    const templateMenu = () => {
        return (
            <div className='d-contents'>
                <Toast ref={toastTopRight} position="top-right" />
                <div className='border-admin overflow-hidden' style={{ height: "15%" }}>
                    <div className='row p-3'>
                        <div className='col col-3'>
                            <Image src='/dual-logo.jpg' width='40px' height='40px' />
                        </div>
                        <div className='col col-9'>
                            <p className='m-0'><strong>DUAL</strong></p>
                            <small className='m-0 fz-12'>Pole & Aerial Studio</small>
                        </div>
                    </div>
                </div>
                <div className='border-admin' style={{ height: "65%", padding: "20px", maxHeight: "575px" }}>
                    {Menus.map((e, i) => {
                        return (
                            <div key={"opciones" + i} className={`list-admin ${activo === i ? "list-admin-active" : ""}`} onClick={() => { setActivo(i), setVista(e.text), setVisible(false) }}><span className={e.icon + " me-3"}></span>{e.text}</div>
                        )
                    })}
                </div>
                <div className='border-admin pt-1 ps-4 overflow-hidden' style={{ height: "20%" }}>
                    <div className='row'>
                        <div className='col col-3'>
                            <Avatar label={cortarTexto(Data.nombre, 2)} className='icon-admin' shape="circle" />
                        </div>
                        <div className='col col-9'>
                            <p className='m-0'><strong>{Data?.nombre}</strong></p>
                            <small className='m-0 fz-12'>{Data?.rol}</small>
                        </div>
                    </div>
                    <p className='mt-2 pointer' onClick={() => cerrarSesion()}><span className='pi pi-sign-out me-2'></span>Cerrar sesión</p>
                </div>
            </div>
        )
    }
    return (
        <div className='d-flex'>
            <Notificacion mensaje={data.notificacion} />
            <Loader visible={data?.load?.activo} texto={data?.load?.mensaje} />
            <div className='s1 vh-100' style={{ width: "18%" }}>
                {templateMenu()}
            </div>
            <Sidebar visible={visible} onHide={() => setVisible(false)}>
                {templateMenu()}
            </Sidebar>
            <div className='s2 vh-100 p-2 admin-content' style={{ width: "82%" }}>
                <Button
                    icon="pi pi-bars"
                    className="menu-btn mb-2 br-15"
                    onClick={() => setVisible(true)}
                />
                {contenido()}
            </div>
        </div>
    )
}
