// import styles from "./page.module.css";
import Banner from "@/componentes/banner";
import Menu from "../componentes/menu";
import TabHome from "@/componentes/tab";
import { Button } from 'primereact/button';
import PlanPaquete from "@/componentes/plan";
import HorarioHome from "@/componentes/horario";
import Mensulidad from "@/componentes/mensualidad";
import Contactanos from "@/componentes/contactanos";
import { NuestrasClases } from "@/componentes/nuestrasClases";
import { Nosotros } from "@/componentes/nosotros";
import { FooterHome } from "@/componentes/footerHome";

const PlanesJson = [
  { clase: "col col-12 col-md-6", icon: "pi pi-credit-card plan-icon", plan: "4 CLASES", meses: ["1550", "1500"], anualidad: ["2720", "2650"] },
  { clase: "col col-12 col-md-6", icon: "pi pi-credit-card plan-icon", plan: "8 CLASES", meses: ["2680", "2600"], anualidad: ["4950", "4860"] },
  { clase: "col col-12 col-md-6", icon: "pi pi-credit-card plan-icon", plan: "12 CLASES", meses: ["3650", "3550"], anualidad: ["6600", "6490"] },
  { clase: "col col-12 col-md-6", icon: "pi pi-credit-card plan-icon", plan: "TODO INCLUIDO", meses: ["4880", "4750"], anualidad: ["8700", "8450"] },
]
const mensualidadAereas = { titulo: "CLASES AEREAS", duracion: "DURACIÓN: 1hr 30min", clases: ["Pole fitness", "Acrobacia en tela", "Aro aéreo", "Aerial kids", "Hammock"], cantidadPrecio: [{ cantidad: "1 CLASE", precio: "$100" }, { cantidad: "4 CLASES", precio: "$299" }, { cantidad: "8 CLASES", precio: "$549" }, { cantidad: "12 CLASES", precio: "$799" }, { cantidad: "TODO INCLUIDO", precio: "$999" }], descripcion: ["La mensualidad 'TODO INCLUIDO' incluye todas las clases aereas que desees tomar mas 4 clases complemtarias al mes", "Las clases deben de tomarse en el transcurso del mes, no se pueden recuperar en meses subsecuentes"] }

const mensualidadComplementarias = { titulo: "CLASES COMPLEMENTARIAS", duracion: "DURACIÓN: 1hr ", clases: ["Yoga", "Cumbia", "Salsa", "Bachata"], cantidadPrecio: [{ cantidad: "1 CLASE", precio: "$70" }, { cantidad: "4 CLASES", precio: "$239" }, { cantidad: "8 CLASES", precio: "$399" }, { cantidad: "12 CLASES", precio: "$499" }, { cantidad: "TODO INCLUIDO", precio: "$599" }], descripcion: ["Las clases deben de tomarse en el transcurso del mes, no se pueden recuperar en meses subsecuentes"] }

export default function Home() {
  return (
    <div >
      <Menu />
      <Banner />
      <div className="container mt-5 mb-5 pt-5 pb-5" >
        <NuestrasClases />
        <div className="mt-5">
          <TabHome />
        </div>
      </div>
      <div className="">
        <Nosotros />
      </div>
      <div className="container espacio">
        {/* <div className="titulo-dual" >CONOCE NUESTROS PLANES</div>
        <div className="row mt-3">

          {PlanesJson.map((e, i) => {
            return (
              <PlanPaquete key={"planes" + i} planData={e} />
            )
          })}
        </div>
        <div className="espacio">
          <div className="titulo-dual">MENSUALIDAD</div>
          <div className="row">
            <div className="col col-12 col-md-6">
              <Mensulidad data={mensualidadAereas} />
            </div>
            <div className="col col-12 col-md-6">
              <Mensulidad data={mensualidadComplementarias} />
            </div>
          </div>
        </div> */}
        <div className="espacio">
          <div className="contenedor-1 mb-4" id="horarios">
            <span className="pi pi-clock me-2"></span>
            Horarios de clases
          </div>
          <div className="m-auto">
            <HorarioHome />
          </div>
        </div>
      </div>
      <Contactanos />
      <FooterHome />
    </div>
    
  );
}
