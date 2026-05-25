import { Button } from "primereact/button";
import TituloAdmin from "../tituloAdmin";
import { useEffect, useState } from "react";
import CreadorFormularios from "../CreadorFormularios";
import global from "@/js/jsons/global";
import { logE, obtenerFecha, PrimeraMayuscula } from "@/js/scrips";
import ListadoUsuario from "../listadoUsuario";
import GraficaDona from "../graficaDona";
import GraficasBarras from "../GraficaBarra";
import { servicesPole } from "@/service/api";
import { Avatar } from "primereact/avatar";
const fechasPagos = [
    { id: "fechasPagos", type: "calendar", title: "Mes de reporte", classDiv: "col col-12 col-md-12 max-width ms-auto", placeholder: "fecha", classLabel: "", view: "month", dateFormat: "mm/yy" },
]
export default function Reportes() {
    // const [Tab, setTab] = useState({ labels: ["Horario semanal", "Lista de clases"], index: 0 });
    const [Resumen, setResumen] = useState({})
    const [Formulario, setFormulario] = useState({ fechasPagos: new Date() })

    const datosPagos = async (finicio, ffin) => {
        let listaResumen = await servicesPole.pagos.consultarResumen(finicio, ffin);
        // console.log("22", listaResumen.data);
        setResumen(listaResumen.data)
    }
    const templateValores = ({ icon = "", color = "", titulo = "", des = "" } = {}) => {
        return (
            <div className="card-efect card text-start br-15 ps-4 pe-4 pt-1 pb-1">
                <div className="row">
                    <div className="col col-2 d-flex align-items-center">
                        {/* {item.alumno.avatar} */}
                        <Avatar icon={icon} className={'icon-admin p-3 ' + color} shape="circle" />
                    </div>
                    <div className="col col-9 text-center">
                        <div className="m-0 fz-15 text-gray ms-2">{titulo}</div>
                        <div className="m-0 fz-12 text-gray-2 ms-2">
                            <strong className={"fz-30 " + color}>
                                <span>{des}</span>
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    useEffect(() => {
        let actualDate = obtenerFecha({ date: Formulario.fechasPagos })
        let inicioMes = obtenerFecha({ date: actualDate.inicioMes, separador: "-" }).formato
        let finMes = obtenerFecha({ date: actualDate.finMes, separador: "-" }).formato
        datosPagos(inicioMes, finMes)
    }, [Formulario.fechasPagos])
    return (
        <div>
            <div className="row">
                <div className="col col-12 col-md-8">
                    <TituloAdmin titulo={"Reportes Financieros"} descripcion={"Análisis de ingresos y pagos"} />
                </div>
                <div className="col col-12 col-md-4 text-end d-flex align-items-center">
                    <div className="ms-auto">
                        <CreadorFormularios
                            key="formulario-pagos"
                            campos={fechasPagos}
                            datos={Formulario}
                            control={setFormulario}
                        />
                    </div>
                </div>
                <div className="col col-12 col-md-4">
                    <div className="ps-3">
                        {templateValores({ icon: "pi pi-dollar", color: "text-success", titulo: "Ingresos Totales", des: "$" + Resumen.ingresosTotales })}
                    </div>
                </div>
                <div className="col col-12 col-md-4">
                    <div className="ps-3">
                        {templateValores({ icon: "pi pi-ticket", color: "text-dual", titulo: "Transacciones", des: Resumen.numeroTransacciones })}
                    </div>
                </div>
                <div className="col col-12 col-md-4">
                    <div className="ps-3">
                        {templateValores({ icon: "pi pi-chart-line", color: "text-dual-2", titulo: "Promedio por Transacción", des: Resumen.promedioTransacciones })}
                    </div>
                </div>
                <div className="col col-12 col-md-6">
                    <div className="card card-efect p-3">
                        <p><span className="pi pi-credit-card me-2"></span>Ingresos por Tipo</p>
                        <GraficaDona
                            ingresosPorTipo={Resumen.ingresosPorTipo}
                        />
                    </div>
                </div>
                <div className="col col-12 col-md-6">
                    <div className="card card-efect p-3">
                        <p><span className="pi pi-dollar me-2"></span>Ingresos por Método de Pago</p>
                        <GraficasBarras
                            ingresosPorMetodoPago={Resumen.ingresosPorMetodoPago}
                        />
                    </div>
                </div>
                <div className="col col-12 col-md-6">
                    <div className="card card-efect p-3">
                        <div className="row">
                            <div className="col col-12"><strong>Desglose por Tipo</strong></div>
                            {Resumen.ingresosPorTipo !== undefined &&
                                Object.keys(Resumen?.ingresosPorTipo).map((e, i) => {
                                    return (
                                        <div className="row" key={"tipos" + i}>
                                            <div className="col col-6">
                                                <p>{PrimeraMayuscula(e)}</p>
                                            </div>
                                            <div className="col col-6 text-end"><strong>${Resumen.ingresosPorTipo[e]}</strong></div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="col col-12 col-md-6">
                    <div className="card card-efect p-3">
                        <div className="row">
                            <div className="col col-12"><strong>Desglose por Método</strong></div>
                            {Resumen.ingresosPorMetodoPago !== undefined &&
                                Object.keys(Resumen?.ingresosPorMetodoPago).map((e, i) => {
                                    return (
                                        <div className="row" key={"tipos" + i}>
                                            <div className="col col-6">
                                                <p>{PrimeraMayuscula(e)}</p>
                                            </div>
                                            <div className="col col-3 text-end">
                                                <strong>{Resumen.ingresosPorMetodoPago[e].cantidad}</strong>
                                            </div>
                                            <div className="col col-3 text-end">
                                                <strong>${Resumen.ingresosPorMetodoPago[e].total}</strong>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}