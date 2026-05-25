import { Button } from "primereact/button";
import TituloAdmin from "../tituloAdmin";
import { useEffect, useState } from "react";
import CreadorFormularios from "../CreadorFormularios";
import global from "@/js/jsons/global";
import { logE, obtenerFecha } from "@/js/scrips";
import Modal from "../modal";
import SinContenido from "../sinContendio";
import { Chip } from "primereact/chip";
import { InputSwitch } from "primereact/inputswitch";
import ListadoUsuario from "../listadoUsuario";
import { Tag } from "primereact/tag";
const fPromociones = [
    { id: "activa", type: "switch", title: "", classDiv: "col col-12", classLabel: "d-none" },
]
const fPromocionesCrear = [
    { id: "nombre", type: "text", title: "Nombre de la promoción *", classDiv: "col col-12", required: true, error: "El campo Promoción es requerido" },
    { id: "descuento", type: "select", title: "Tipo de descuento *", classDiv: "col col-12 col-md-6", required: true, error: "El campo Tipo de descuento es requerido", options: [], optionLabel: "", optionValue: "" },
    { id: "valor", type: "number", title: "Valor de descuento *", classDiv: "col col-12 col-md-6", required: true, error: "El campo Valor de descuento es requerido" },
    { id: "codigo", type: "text", title: "Código de descuento", classDiv: "col col-12" },
    { id: "fechaInicio", type: "calendar", title: "Fecha inicio", classDiv: "col col-12 col-md-6" },
    { id: "fechaFin", type: "calendar", title: "Fecha fin", classDiv: "col col-12 col-md-6" },
    { id: "minima", type: "number", title: "Compra minima ($)", classDiv: "col col-12 col-md-6" },
    { id: "maximos", type: "number", title: "Usos maximos", classDiv: "col col-12 col-md-6" },
    { id: "descripcion", type: "textArea", title: "Descripción", classDiv: "col col-12" },
]
export default function Promociones() {
    // const [Tab, setTab] = useState({ labels: ["Horario semanal", "Lista de clases"], index: 0 });
    const [Tabla, setTabla] = useState(null)
    const [Formulario, setFormulario] = useState({ activa: true })
    const [checked, setChecked] = useState(false);
    const accionFormulario = () => {
        return (
            <div className="d-flex mt-3 text-end">
                <Button label="Cancelar" className="br-15 me-2 ms-auto" severity="secondary" text raised onClick={() => { setModalC({ ...ModalC, activar: false }), setFormulario({}) }} />
                <Button label="Guardar" className="btn btn-dual br-15" onClick={() => setFormulario({})} />
            </div>

        )
    }
    const [ModalC, setModalC] = useState({ activar: false, header: "Nueva promoción", style: { width: "50%", margin: "auto" }, footer: accionFormulario, class: "bg-admin modal-container" })
    return (
        <div>
            <Modal data={ModalC} control={setModalC}>
                {/* fPromocionesCrear */}
                <CreadorFormularios
                    key="formulario-promociones"
                    campos={fPromocionesCrear}
                    datos={Formulario}
                    control={setFormulario}
                />
            </Modal>
            <div className="row">
                <div className="col col-7">
                    <TituloAdmin titulo={"Promociones"} descripcion={"Gestiona ofertas especiales para tus estudiantes"} />
                </div>
                <div className="col col-5 text-end d-flex align-items-center">
                    <div className="ms-auto">
                        <Button icon="pi pi-plus" label="Nueva promoción" className="ms-auto btn-dual br-15 me-3" onClick={() => setModalC({ ...ModalC, activar: true, tipo: "plan" })} />
                    </div>
                </div>
            </div>
            <div className="row">
                {global.promociones.length > 0 ?
                    global.promociones.map((e, i) => {
                        return (
                            <div className="col col-12 col-md-4" key={"promocion" + i}>
                                <div className="card card-efect p-3 br-15">
                                    <div className="row">
                                        <div className="col col-8">
                                            <ListadoUsuario generico={true} item={{ icono: "pi pi-check-circle text-dual", titulo: <strong className="fz-20">Navidad</strong>, descripcion: <Chip className="fz-10" label={e.codigo} /> }} />
                                        </div>
                                        <div className="col col-4 text-end">
                                            <Tag severity={"danger"} value={"- " + e.descuento + " %"} rounded className="bg-dual-2 text-white ps-2 pe-2"></Tag>
                                        </div>
                                        <div className="col col-12">
                                            <p className="mb-2">{e.descripcion}</p>
                                            <p className="m-0"><span className="pi pi-calendar me-2"></span>{e.fechaIncio + " - " + e.fechaFin}</p>
                                            <p className="m-0"><span className="pi pi-tag me-2"></span>Compra minima: ${e.compraMinima}</p>
                                            <p className="m-0">Usos: 0/{e.usos}</p>
                                            <hr />
                                        </div>
                                        <div className="col col-6">
                                            <div className="d-flex align-items-center">
                                                <CreadorFormularios
                                                    key="formulario-promociones"
                                                    campos={fPromociones}
                                                    datos={Formulario}
                                                    control={setFormulario}
                                                />
                                                <span className="ms-2">Activa</span>
                                            </div>
                                        </div>
                                        <div className="col col-6 text-end"><span className="pi pi-trash text-danger"></span></div>
                                    </div>
                                </div>
                            </div>
                        )
                    }) :
                    <SinContenido icon={"pi pi-list"} titulo={"No hay promociones"} descripcion={"Comienza agregando tu primer promocion"} btnLabel={"Nueva promoción"} accion={() => setModalC({ ...ModalC, activar: true, tipo: "plan" })} />
                }
            </div>
        </div>
    )
}