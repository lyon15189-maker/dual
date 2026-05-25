import { Button } from "primereact/button";
import TituloAdmin from "../tituloAdmin";
import { useEffect, useState } from "react";
import TableConfig from "@/js/clases/POOTabla";
import TablaPersonaliza from "../TablaPersonaliza";
import { Message } from "primereact/message";
import Modal from "../modal";
import CreadorFormularios from "../CreadorFormularios";
const Horario = [
    {
        lunes: { color: "color1", clase: "Yoga", horario: "17:00", lugares: "10 lugares" },
        martes: { color: "color2", clase: "Acrobacia en tela", horario: "09:00", lugares: "10 lugares" },
        miercoles: { color: "color3", clase: "Pole exotic", horario: "16:00", lugares: "10 lugares" },
        jueves: { color: "color4", clase: "Aerial kids", horario: "16:30", lugares: "10 lugares" },
        viernes: { color: "color1", clase: "Yoga", horario: "08:30", lugares: "10 lugares" },
        sabado: { color: "color5", clase: "Pole fitnnes", horario: "08:30", lugares: "10 lugares" },
        domingo: { color: "color5", clase: "Pole fitnnes", horario: "08:00", lugares: "10 lugares" },
    },
    {
        lunes: { color: "color5", clase: "Pole fitnnes", horario: "18:15", lugares: "10 lugares" },
        martes: { color: "color6", clase: "Hammok / Acrobacia en tela", horario: "18:15", lugares: "10 lugares" },
        miercoles: { color: "color7", clase: "Yoga con pelota", horario: "17:45", lugares: "10 lugares" },
        jueves: { color: "color2", clase: "Acrobacia en tela", horario: "18:15", lugares: "10 lugares" },
        viernes: { color: "color8", clase: "Acrobacia en tela / Aro aereo", horario: "09:45", lugares: "10 lugares" },
        sabado: { color: "color9", clase: "Hells", horario: "10:15", lugares: "10 lugares" },
        domingo: { color: "color3", clase: "Pole exotic", horario: "09:45", lugares: "10 lugares" },
    },
    {
        lunes: { color: "color10", clase: "Twerk", horario: "20:15", lugares: "10 lugares" },
        martes: { color: "color2", clase: "Acrobacia en tela", horario: "20:00", lugares: "10 lugares" },
        miercoles: { color: "", clase: "", horario: "", lugares: "" },
        jueves: { color: "color2", clase: "Acrobacia en tela", horario: "20:00", lugares: "10 lugares" },
        viernes: { color: "color4", clase: "Aerial kids", horario: "16:30", lugares: "10 lugares" },
        sabado: { color: "color11", clase: "Yoga flow", horario: "11:30", lugares: "10 lugares" },
        domingo: { color: "color8", clase: "Acrobacia en tela / Aro aereo", horario: "11:15", lugares: "10 lugares" },
    },
    {
        lunes: { color: "", clase: "", horario: "", lugares: "" },
        martes: { color: "", clase: "", horario: "", lugares: "" },
        miercoles: { color: "", clase: "", horario: "", lugares: "" },
        jueves: { color: "", clase: "", horario: "", lugares: "" },
        viernes: { color: "color5", clase: "Pole fitnnes", horario: "18:15", lugares: "10 lugares" },
        sabado: { color: "", clase: "", horario: "", lugares: "" },
        domingo: { color: "", clase: "", horario: "", lugares: "" },
    }
];
const fNuevaClase = [
    { id: "nombre", type: "text", title: "Nombre de la clase *", classDiv: "col col-12", placeholder: "tu nombre" },
    { id: "instructor", type: "select", title: "Instructor", classDiv: "col col-12", options: [{ name: "Administrador", value: "0" }, { name: "Recepcionista", value: "1" }, { name: "Alumno", value: "2" },], optionLabel: "name", optionValue: "value" },
    { id: "dia", type: "select", title: "Día", classDiv: "col col-6", options: [{ name: "Lunes", value: "0" }, { name: "Martes", value: "1" }, { name: "Miercoles", value: "2" }, { name: "Jueves", value: "3" }, { name: "Viernes", value: "4" }, { name: "Sabado", value: "5" }, { name: "Domingo", value: "6" }], optionLabel: "name", optionValue: "value" },
    { id: "horario", type: "horario", title: "Hora", classDiv: "col col-6", placeholder: "Selecciona la hora", hourFormat: "24", timeOnly: true },
    { id: "capacidad", type: "number", title: "Capacidad maxima", classDiv: "col col-6" },
    { id: "duracion", type: "number", title: "Duración (min)", classDiv: "col col-6" },
    { id: "descripcion", type: "textArea", title: "Descripción", classDiv: "col col-12", placeholder: "Descripción de la clase" },
]
const colores = ["color1", "color2", "color3", "color4", "color5", "color6", "color7", "color8", "color9", "color10", "color11", "color12", "color13", "color14", "color15", "color16"]
export default function Reservacion(props) {
    // const [Tab, setTab] = useState({ labels: ["Horario semanal", "Lista de clases"], index: 0 });
    const [Tabla, setTabla] = useState(null)
    const [Formulario, setFormulario] = useState({})
    const accionFormulario = () => {
        return (
            <div className="d-flex mt-3 text-end">
                <Button label="Cancelar" className="br-15 me-2 ms-auto" severity="secondary" text raised onClick={() => { setModalC({ ...ModalC, activar: false }), setFormulario({}) }} />
                <Button label="Registrar" className="btn btn-dual br-15" onClick={() => setFormulario({})} />
            </div>

        )
    }
    const [ModalC, setModalC] = useState({ activar: false, header: "Nueva clase", style: { width: "50%", margin: "auto" }, footer: accionFormulario, class: "bg-admin" })
    const clase = (data, dia) => {
        // console.log(data);
        if (Formulario.horario !== undefined) {
            var hr = Formulario.horario.getHours();
            var min = Formulario.horario.getMinutes();
        }
        return (
            <div className="w-100">
                <p className="m-0">{data?.[dia]?.clase || Formulario?.nombre}</p>
                <p className="m-0 fz-12">{data?.[dia]?.horario || hr + ":" + min}</p>
                <p className="m-0 fz-12">{data?.[dia]?.lugares || Formulario?.capacidad + " lugares"}</p>
            </div>
        )
    }

    const editarClase = (data, dia) => {
        console.log(data[dia]);
        // setModalC({ ...ModalC, activar: true })
    }
    const crearTabla = () => {
        const tbl = new TableConfig()
        tbl.addCol("lunes", "Lunes", true, false, {
            type: 'text',
            body: (rowData) => (
                <div className="text-start row" key={"lunes"}>
                    {(rowData?.lunes !== undefined && rowData?.lunes?.clase !== "" ) ?
                        <Message text={() => clase(rowData, "lunes")} className={rowData?.lunes?.color + " br-15 clases-semana pointer"} onClick={() => editarClase(rowData, "lunes")} /> :
                        <></>
                    }
                </div>
            ),
        })
        tbl.addCol("martes", "Martes", true, false, {
            type: 'text',
            body: (rowData) => (
                <div className="text-start" key={"martes"}>
                    {rowData?.martes !== undefined && rowData?.martes?.clase !== "" ?
                        <Message text={() => clase(rowData, "martes")} className={rowData?.martes?.color + " br-15 clases-semana"} onClick={() => setModalC({ ...ModalC, activar: true })} /> :
                        <></>
                    }
                </div>
            )
        })
        tbl.addCol("miercoles", "Miercoles", true, false, {
            type: 'text',
            body: (rowData) => (
                <div className="text-start" key={"miercoles"}>
                    {rowData?.miercoles !== undefined && rowData?.miercoles?.clase !== "" ?
                        <Message text={() => clase(rowData, "miercoles")} className={rowData?.miercoles?.color + " br-15 clases-semana"} onClick={() => setModalC({ ...ModalC, activar: true })} /> :
                        <></>
                    }
                </div>
            )
        }, false)
        tbl.addCol("jueves", "Jueves", true, false, {
            type: 'text',
            body: (rowData) => (
                <div className="mt-2 text-start" key={"jueves"}>
                    {rowData?.jueves !== undefined && rowData?.jueves?.clase !== "" ?
                        <Message text={() => clase(rowData, "jueves")} className={rowData?.jueves?.color + " br-15 clases-semana"} onClick={() => setModalC({ ...ModalC, activar: true })} /> :
                        <></>
                    }
                </div>
            )
        }, false)
        tbl.addCol("viernes", "Viernes", true, false, {
            type: 'text',
            body: (rowData) => (
                <div className="mt-2 text-start" key={"viernes"}>
                    {rowData?.viernes !== undefined && rowData?.viernes?.clase !== "" ?
                        <Message text={() => clase(rowData, "viernes")} className={rowData?.viernes?.color + " br-15 clases-semana"} onClick={() => setModalC({ ...ModalC, activar: true })} /> :
                        <></>
                    }
                </div>
            )
        }, false)
        tbl.addCol("sabado", "Sabado", true, false, {
            type: 'text',
            body: (rowData) => (
                <div className="text-start row" key={"sabado"}>
                    {rowData?.sabado !== undefined && rowData?.sabado?.clase !== "" ?
                        <Message text={() => clase(rowData, "sabado")} className={rowData?.sabado?.color + " br-15 clases-semana"} onClick={() => setModalC({ ...ModalC, activar: true })} /> :
                        <></>
                    }
                </div>
            ),
        })
        tbl.addCol("domingo", "Domingo", true, false, {
            type: 'text',
            body: (rowData) => (
                <div className="text-start row" key={"domingo"}>
                    {rowData?.domingo !== undefined && rowData?.domingo?.clase !== "" ?
                        <Message text={() => clase(rowData, "domingo")} className={rowData?.domingo?.color + " br-15 clases-semana"} onClick={() => setModalC({ ...ModalC, activar: true })} /> :
                        <></>
                    }
                </div>
            ),
        })
        tbl.accionRecarga(() => recargarTodo())
        tbl.addData(Horario || []);
        tbl.addDataKey('clasesTabla')
        setTabla(tbl)
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
                    campos={fNuevaClase}
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
                <Message text={() => clase()} className={Formulario.color + " br-15 clases-semana p-3 ps-5 pe-5 mt-3 me-2 pointer w-100"} />
            </Modal>
            <div className="row">
                <div className="col col-6">
                    <TituloAdmin titulo={"Reservaciones"} descripcion={"Gestiona reservas y asistencia de clases"} />
                </div>
                <div className="col col-6 text-end d-flex align-items-center">
                    {/* <Button icon="pi pi-sliders-h" label="Tipos de clase" className="br-15 me-2 ms-auto" severity="secondary" text raised onClick={() => setModalC({ ...ModalC, activar: false })} /> */}
                    <Button icon="pi pi-plus" label="Nueva clase" className="ms-auto me-2 btn-dual br-15" onClick={() => setModalC({ ...ModalC, activar: true })} />
                </div>
            </div>
            {/* <TabComponent data={Tab} control={setTab} /> */}
            <h2 className="text-dual">Horario semanal</h2>
            <div>
                <TablaPersonaliza
                    datos={Tabla}
                    control={setTabla}
                    clase={true}
                />
            </div>
        </div>
    )
}