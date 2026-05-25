'use client';
import { Image } from "primereact/image";
import CreadorFormularios from "../../componentes/CreadorFormularios";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import Link from "next/link";
import TabComponent from "@/componentes/tabComponent";
import Notificacion from "@/componentes/notificacion";
import { useRouter } from 'next/navigation'
import { servicesPole } from "@/service/api";
import { cumplioEstructura, validarEstructura } from "@/js/scrips";
import Loader from "@/componentes/loader";
import { useGlobalStore } from "@/stores/itemStore";
const fAcceso = [
    { id: "email", type: "text", title: "Email:", classDiv: "col col-12", placeholder: "ejemplo@email.com" },
    { id: "password", type: "pass", title: "Contraseña:", classDiv: "col col-12" },
]
const fRegistrarse = [
    { id: "nombre", type: "text", title: "Nombre:", classDiv: "col col-12", placeholder: "Nombre del usaurio", required: true },
    { id: "apellidos", type: "text", title: "Apellidos:", classDiv: "col col-12", placeholder: "Apellidos del usaurio", required: true },
    { id: "email", type: "text", title: "Email:", classDiv: "col col-12", placeholder: "ejemplo@email.com", required: true },
    { id: "telefono", type: "text", title: "Telefono", classDiv: "col col-12", placeholder: "5512345678", required: true },
    { id: "rol", type: "select", title: "Rol", classDiv: "col col-12", options: [{ name: "Alumno", value: "alumno" }, { name: "Cliente", value: "Cliente" }], optionValue: "value", optionLabel: "name", required: true },
    { id: "password", type: "pass", title: "Contraseña", classDiv: "col col-12", required: true },
]
const templateIniciar = {
    email: "",
    password: ""
}
const templateRegistrar = {
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    rol: "",
}
export default function Acceso(params) {
    const [Formulario, setFormulario] = useState({});
    const [Not, setNot] = useState(null);
    const [Load, setLoad] = useState(false);
    const [Tab, setTab] = useState({ labels: ["Iniciar sesión", "Registrarse"], index: 0 });
    const { data, addData } = useGlobalStore();
    const router = useRouter()

    const accionesServicio = async (tipo, data) => {
        let res = {}
        switch (tipo) {
            case "registrar":
                // console.log(data);
                res = await servicesPole.dashboard.crearUsuarios(data)
                break;
            case "iniciar":
                res = await servicesPole.home.iniciarSesion(data)
                break;

            default:
                break;
        }
        return res
    }
    const acciones = async ({ tipo = "iniciar", template = templateIniciar, mensaje = "Iniciando sesión" } = {}) => {
        setLoad(true)
        let res = validarEstructura(template, Formulario)
        if (cumplioEstructura(res)) {
            try {
                let respuesta = await accionesServicio(tipo, res.value)
                // console.log("64", respuesta);
                if (tipo == "iniciar") {
                    addData("sesion", respuesta.data)
                    router.push("/sesion")
                }
                setTab({ ...Tab, index: 0 })
                setLoad(false)
                setNot({ severity: 'success', summary: 'Acción completada', detail: mensaje, life: 3000 })
            } catch (error) {
                setLoad(false)
                console.log(error);
                setNot({ severity: 'error', summary: 'Hubo un problema', detail: 'Usuario o contraseña incorrectos', life: 3000 })
            }
        } else {
            setLoad(false)
            setNot({ severity: 'error', summary: 'Hubo un problema', detail: 'Completa todos los campos', life: 3000 })
        }
    }
    return (
        <div className="container-fluid vh-100 p-0 login-container">
            <Notificacion mensaje={Not} />
            <Loader visible={Load} texto="Consultando datos" />
            <div className="row">
                <div className="col col-12 col-md-6 login-image vh-100 centrar">
                    <div className="d-grid text-white p-5 w-100">
                        <Image src="/dual-logo.jpg" height="80px" width="80px" className="br-15 overflow-hidden w-max" />
                        <strong className="text-white fz-40">DUAL</strong>
                        <p className="fz-20">Pole & Aerial Studio</p>
                        <p className="fz-15">Sistema de gestión integral para tu estudio. Administra<br /> estudiantes, clases, pagos e inventario en un solo lugar.</p>
                        <div className="mt-3 row">
                            <div className="col col-6">
                                <Link className="me-2 text-white me-4" href={"/"}><span className="me-1 pi pi-home"></span> Inicio</Link>
                                <Link className="me-2 text-white" href={"/tienda"}><span className="me-2 pi pi-shop"></span>Tienda</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col col-12 col-md-6 bg-blanco centrar vh-100 overflow-auto">
                    <div className="card w-75 m-auto p-3">
                        <div className="text-center">
                            <strong className="fz-30">Bienvenido</strong>
                            <p>Accede a tu cuenta para continuar</p>
                            <TabComponent data={Tab} control={setTab} />
                            {Tab.index == 0 &&
                                <div className="text-start mt-3">
                                    <CreadorFormularios
                                        key="Acceso-formulario"
                                        campos={fAcceso}
                                        datos={Formulario}
                                        control={setFormulario}
                                    />
                                    <Button className="btn btn-dual text-white w-100" onClick={() => acciones()}>Iniciar sesión</Button>
                                </div>
                            }
                            {Tab.index == 1 &&
                                <div className="text-start mt-3">
                                    <CreadorFormularios
                                        key="formulario-registro"
                                        campos={fRegistrarse}
                                        datos={Formulario}
                                        control={setFormulario}
                                    />
                                    <Button className="btn btn-dual text-white w-100" onClick={() => acciones({ tipo: "registrar", template: templateRegistrar, mensaje: "Usuario registrado" })}>Crear cuenta</Button>
                                </div>
                            }
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}