import { Avatar } from "primereact/avatar";
import { ImagenEtiqueta } from "./imagenEtiqueta";
import { IconoDescripcion } from "./iconoDescripcion";

export function Nosotros(params) {
    return (
        <div className="bg-seccion">
            <div className="container">
                <div className="row">
                    <div className="col col-12 col-md-6">
                        <ImagenEtiqueta/>
                    </div>
                    <div className="col col-12 col-md-6 text-start">
                        <div className="contenedor-1" id="planes">
                            <span className="pi pi-users me-2"></span>
                            Sobre Nosotros
                        </div>
                        <strong className="fz-50">Más que un Estudio, <span className="text-dual">una Familia</span></strong>
                        <p className="fz-18">En DUAL creemos que cada persona tiene una artista interior esperando ser descubierta. Nuestro estudio es un espacio seguro donde puedes explorar tu creatividad, fortalecer tu cuerpo y conectar con una comunidad increíble.</p>

                        <p className="fz-18">Con instructoras certificadas y apasionadas, te guiaremos en cada paso de tu viaje, ya sea que estés dando tus primeros giros o perfeccionando trucos avanzados.</p>
                        <div className="row">
                            <div className="col col-12 col-md-6">
                                <IconoDescripcion icono={"pi pi-verified"} titulo={"Certificadas"} descripcion={"Instructoras profesionales"}/>
                                <IconoDescripcion icono={"pi pi-users"} titulo={"Comunidad"} descripcion={"Apoyo constante"}/>
                            </div>
                            <div className="col col-12 col-md-6">
                                <IconoDescripcion icono={"pi pi-heart"} titulo={"Ambiente"} descripcion={"Cálido y motivador"}/>
                                <IconoDescripcion icono={"pi pi-sparkles"} titulo={"Todos los niveles"} descripcion={"Desde principiante"}/>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}