import { Button } from "primereact/button";
import TituloAdmin from "../tituloAdmin";
import { useEffect, useState } from "react";
import { Message } from "primereact/message";
import Modal from "../modal";
import CreadorFormularios from "../CreadorFormularios";
import global from "@/js/jsons/global";
import { servicesPole } from "@/service/api";
import { cumplioEstructura, validarEstructura, validarFormulario } from "@/js/scrips";
import { useGlobalStore } from "@/stores/itemStore";
const hrsop = [
    { name: "08:00", value: "08:00" },
    { name: "08:30", value: "08:30" },
    { name: "09:00", value: "09:00" },
    { name: "09:30", value: "09:30" },
    { name: "10:00", value: "10:00" },
    { name: "10:30", value: "10:30" },
    { name: "11:00", value: "11:00" },
    { name: "11:30", value: "11:30" },
    { name: "12:00", value: "12:00" },
    { name: "12:30", value: "12:30" },
    { name: "13:00", value: "13:00" },
    { name: "13:30", value: "13:30" },
    { name: "14:00", value: "14:00" },
    { name: "14:30", value: "14:30" },
    { name: "15:00", value: "15:00" },
    { name: "15:30", value: "15:30" },
    { name: "16:00", value: "16:00" },
    { name: "16:30", value: "16:30" },
    { name: "17:00", value: "17:00" },
    { name: "17:30", value: "17:30" },
    { name: "18:00", value: "18:00" },
    { name: "18:30", value: "18:30" },
    { name: "19:00", value: "19:00" },
    { name: "19:30", value: "19:30" },
    { name: "20:00", value: "20:00" },

]
const fNuevaClase = [
    { id: "nombre", type: "text", title: "Nombre de la clase *", classDiv: "col col-12", placeholder: "tu nombre" },
    { id: "instructor", type: "select", title: "Instructor", classDiv: "col col-12", options: [], optionLabel: "name", optionValue: "value" },
    { id: "lunes", type: "group", title: "Lunes", classDiv: "col-6", options: hrsop, optionLabel: "name", optionValue: "value" },
    { id: "martes", type: "group", title: "Martes", classDiv: "col-6", options: hrsop, optionLabel: "name", optionValue: "value" },
    { id: "miercoles", type: "group", title: "Miercoles", classDiv: "col-6", options: hrsop, optionLabel: "name", optionValue: "value" },
    { id: "jueves", type: "group", title: "Jueves", classDiv: "col-6", options: hrsop, optionLabel: "name", optionValue: "value" },
    { id: "viernes", type: "group", title: "Viernes", classDiv: "col-6", options: hrsop, optionLabel: "name", optionValue: "value" },
    { id: "sabado", type: "group", title: "Sabado", classDiv: "col-6", options: hrsop, optionLabel: "name", optionValue: "value" },
    { id: "domingo", type: "group", title: "Domingo", classDiv: "col-6", options: hrsop, optionLabel: "name", optionValue: "value" },
    { id: "capacidad", type: "number", title: "Capacidad maxima", classDiv: "col col-12 col-md-6" },
    { id: "capacidadMin", type: "number", title: "Capacidad minima", classDiv: "col col-12 col-md-6" },
    { id: "duracion", type: "number", title: "Duración (min)", classDiv: "col col-12 col-md-6" },
    { id: "descripcion", type: "textArea", title: "Descripción", classDiv: "col col-12", placeholder: "Descripción de la clase" },
]


const colores = ["color1", "color2", "color3", "color4", "color5", "color6", "color7", "color8", "color9", "color10", "color11", "color12", "color13", "color14", "color15", "color16"]
const globalForm = global.creadorClases
const modalDefecto = { activar: false, header: "Nueva clase", style: { width: "50%", margin: "auto" }, class: "bg-admin modal-container" }
export default function Clases(prop) {
    const [DatosFormulario, setDatosFormulario] = useState(fNuevaClase)
    const [Horario, setHorario] = useState({})
    const [Formulario, setFormulario] = useState(globalForm)
    const [ModalC, setModalC] = useState(modalDefecto)
    const clase = (data, dia) => {
        // console.log("66", data);
        return (
            <div className="w-100">
                <p className="m-0">{data?.nombre}</p>
                <p className="m-0 fz-12">{"Duración:" + data?.duracion + " min"}</p>
                <p className="m-0 fz-12">{"Inicio de clase:" + data?.hora}</p>
                <p className="m-0 fz-12">{"Min:" + data?.capacidadMin + " - Max:" + data?.capacidad}</p>
            </div>
        )
    }
    const { addData } = useGlobalStore();
    const construirHorarios = (data) => {
        const diasSemana = [
            "lunes",
            "martes",
            "miercoles",
            "jueves",
            "viernes",
            "sabado",
            "domingo"
        ];
        // console.log("88", diasSemana, data);
        return diasSemana
            .map((dia) => {
                const horas = data[dia];
                // console.log("88", horas);
                if (Array.isArray(horas) && horas.length > 0) {
                    return {
                        dia,
                        horas
                    };
                }

                return null;
            })
            .filter(Boolean); // elimina nulls
    };
    const accionesServicio = async (tipo, datos) => {
        let res = {}
        let obj = datos
        obj.horarios = construirHorarios(Formulario)
        switch (tipo) {
            case "eliminar":
                res = await servicesPole.clases.eliminarClases(Formulario._id)
                break;
            case "editar":
                // console.log("114", obj, Formulario);
                res = await servicesPole.clases.editarClases(obj, Formulario._id)
                break;
            case "crear":
                res = await servicesPole.clases.crearClases(obj)
                break;

            default:
                break;
        }
        return res
    }
    const acciones = async ({ tipo = "crear", template = globalForm, formulario = fNuevaClase, mensaje = "" } = {}) => {
        addData("load", { activo: true, mensaje: "Cargando..." })
        let res = validarEstructura(template, Formulario)
        let validacionFormulario = validarFormulario(formulario, Formulario)
        // console.log("68", res, validacionFormulario);
        if (cumplioEstructura(res) && validacionFormulario.length == 0) {
            try {
                await accionesServicio(tipo, res.value)
                addData("load", { activo: false, mensaje: "Cargando..." })
                addData("notificacion", { severity: 'success', summary: 'Acción completada', detail: mensaje, life: 3000 })
                setModalC(modalDefecto)
                crearTabla()
            } catch (error) {
                addData("load", { activo: false, mensaje: "Cargando..." })
                console.log(error);
                addData("notificacion", { severity: 'error', summary: 'Hubo un problema', detail: 'Usuario o contraseña incorrectos', life: 3000 })
            }
        } else {
            addData("load", { activo: false, mensaje: "Cargando..." })
            addData("notificacion", { severity: 'error', summary: 'Hubo un problema', detail: validacionFormulario[0]?.mensaje, life: 3000 })
        }
    }
    const ordenarHorarios = (clases) => {
        const diasSemana = [
            "lunes",
            "martes",
            "miercoles",
            "jueves",
            "viernes",
            "sabado",
            "domingo"
        ];

        const resultado = {};
        diasSemana.forEach(dia => resultado[dia] = []);

        clases.forEach(clase => {
            clase.horarios.forEach(({ dia, horas }) => {
                if (!resultado[dia]) return;
                horas.forEach(hora => {
                    resultado[dia].push({
                        ...clase,
                        hora, // 🔥 importante
                    });
                });
            });
        });

        // 🔥 ordenar por hora
        Object.keys(resultado).forEach(dia => {
            resultado[dia].sort((a, b) => {
                const [h1, m1] = a.hora.split(":").map(Number);
                const [h2, m2] = b.hora.split(":").map(Number);

                return (h1 * 60 + m1) - (h2 * 60 + m2);
            });
        });

        return resultado;
    };
    const crearTabla = async () => {
        let clas = await servicesPole.clases.consultarClases()
        let maestroSevicio = await servicesPole.dashboard.ObtenerUsuarios({ roles: "maestro" })
        const maestrosA = maestroSevicio.data.map(e => ({
            name: `${e.nombre} ${e.apellidos}`,
            value: e._id
        }));
        fNuevaClase[1].options = maestrosA
        // console.log("201", maestroSevicio, maestrosA);
        setHorario(ordenarHorarios(clas.data))
    }
    const accionesSistema = (tipo) => {
        switch (tipo) {
            case "eliminarClaseFormualario":
                acciones({ tipo: "eliminar", mensaje: "Clase eliminada exitosamente" })
                break;
            case "editarClaseFormualario":
                acciones({ tipo: "editar", mensaje: "Clase actualizada exitosamente" })
                break;
            case "crearClaseFormualario":
                acciones({ tipo: "crear", mensaje: "Clase creada exitosamente" })
                break;

            default:
                break;
        }
    }

    const editarClase = (datos, dia) => {
        let obj = datos
        obj.lunes = []
        obj.martes = []
        obj.miercoles = []
        obj.jueves = []
        obj.viernes = []
        obj.sabado = []
        obj.domingo = []
        obj.horarios.map(e => {
            obj[e.dia] = e.horas
        })
        if (datos?.instructor?._id) {
            obj.instructor = datos?.instructor?._id
        }
        setModalC({ ...ModalC, activar: true, header: obj.nombre, tipo: "editar" })
        setFormulario({ ...Formulario, ...obj })
    }
    useEffect(() => {
        crearTabla()
    }, [])
    return (
        <div>
            <Modal data={ModalC} control={setModalC}>
                {/* asd */}
                <CreadorFormularios
                    key="formulario-clase"
                    campos={DatosFormulario}
                    datos={Formulario}
                    control={setFormulario}
                />
                <p>Color</p>
                {colores.map((e, i) => {
                    return (
                        <Message key={"colores" + i} text={" "} className={e + " br-15 clases-semana p-3 ps-5 pe-5 mt-3 me-2 pointer"} onClick={() => setFormulario({ ...Formulario, color: e })} />
                    )
                })}
                <p>Vista previa</p>
                <div className="mb-5">
                    <Message text={() => clase(Formulario)} className={Formulario.color + " br-15 clases-semana p-3 ps-5 pe-5 mt-3 me-2 pointer w-100"} />
                </div>
                <div className="acciones-modal d-flex mt-3 text-end">
                    <Button label="Cancelar" className="br-15 me-2 ms-auto" severity="secondary" text raised onClick={() => setModalC({ ...ModalC, activar: false, tipo: "crear" })} />
                    {ModalC.tipo == "editar" &&
                        <Button label={"Eliminar"} className="btn btn-dual br-15 me-2" onClick={() => accionesSistema("eliminarClaseFormualario")} />
                    }
                    <Button label={ModalC.tipo == "editar" ? "Editar" : "Registrar"} className="btn btn-dual br-15" onClick={() => accionesSistema(ModalC.tipo == "editar" ? "editarClaseFormualario" : "crearClaseFormualario")} />
                </div>
            </Modal>
            <div className="row">
                <div className="col col-12 col-md-6">
                    <TituloAdmin titulo={"Clases"} descripcion={"Gestiona el horario de clases del estudio"} />
                </div>
                <div className="col col-12 col-md-6 text-end d-flex align-items-center">
                    {/* <Button icon="pi pi-sliders-h" label="Tipos de clase" className="br-15 me-2 ms-auto" severity="secondary" text raised onClick={() => setModalC({ ...ModalC, activar: false })} /> */}
                    <Button icon="pi pi-plus" label="Nueva clase" className="ms-auto me-2 btn-dual br-15" onClick={() => { setModalC({ ...ModalC, activar: true, tipo: "crear" }), setFormulario(globalForm) }} />
                </div>
            </div>
            {/* <TabComponent data={Tab} control={setTab} /> */}
            <h2 className="text-dual">Horario semanal</h2>

            <div className="row">
                <div className="m-hr wp-12 card p-3">
                    <p className="m-0">Lunes</p>
                    {Horario?.lunes?.map((e, i) => {
                        return (
                            <div key={"lunes-" + i} className="pointer">
                                <Message text={() => clase(e, "lunes")} className={e?.color + " br-15 clases-semana card-efect w-100 mt-2"} onClick={() => editarClase(e, "lunes")} />
                            </div>
                        )
                    })}
                </div>
                <div className="m-hr wp-12 card p-3">
                    <p className="m-0">Martes</p>
                    {Horario?.martes?.map((e, i) => {
                        return (
                            <div key={"martes-" + i} className="pointer">
                                <Message text={() => clase(e, "martes")} className={e?.color + " br-15 clases-semana card-efect w-100 mt-2"} onClick={() => editarClase(e, "martes")} />
                            </div>
                        )
                    })}
                </div>
                <div className="m-hr wp-12 card p-3">
                    <p className="m-0">Miercoles</p>
                    {Horario?.miercoles?.map((e, i) => {
                        return (
                            <div key={"miercoles-" + i} className="pointer">
                                <Message text={() => clase(e, "miercoles")} className={e?.color + " br-15 clases-semana card-efect w-100 mt-2"} onClick={() => editarClase(e, "miercoles")} />
                            </div>
                        )
                    })}
                </div>
                <div className="m-hr wp-12 card p-3">
                    <p className="m-0">Jueves</p>
                    {Horario?.jueves?.map((e, i) => {
                        return (
                            <div key={"jueves-" + i} className="pointer">
                                <Message text={() => clase(e, "jueves")} className={e?.color + " br-15 clases-semana card-efect w-100 mt-2"} onClick={() => editarClase(e, "jueves")} />
                            </div>
                        )
                    })}
                </div>
                <div className="m-hr wp-12 card p-3">
                    <p className="m-0">Viernes</p>
                    {Horario?.viernes?.map((e, i) => {
                        return (
                            <div key={"viernes-" + i} className="pointer">
                                <Message text={() => clase(e, "viernes")} className={e?.color + " br-15 clases-semana card-efect w-100 mt-2"} onClick={() => editarClase(e, "viernes")} />
                            </div>
                        )
                    })}
                </div>
                <div className="m-hr wp-12 card p-3">
                    <p className="m-0">Sabado</p>
                    {Horario?.sabado?.map((e, i) => {
                        return (
                            <div key={"sabado-" + i} className="pointer">
                                <Message text={() => clase(e, "sabado")} className={e?.color + " br-15 clases-semana card-efect w-100 mt-2"} onClick={() => editarClase(e, "sabado")} />
                            </div>
                        )
                    })}
                </div>
                <div className="m-hr wp-12 card p-3">
                    <p className="m-0">Domingo</p>
                    {Horario?.domingo?.map((e, i) => {
                        return (
                            <div key={"domingo-" + i} className="pointer">
                                <Message text={() => clase(e, "domingo")} className={e?.color + " br-15 clases-semana card-efect w-100 mt-2"} onClick={() => editarClase(e, "domingo")} />
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    )
}