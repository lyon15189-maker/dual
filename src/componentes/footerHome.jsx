import { Avatar } from "primereact/avatar";
import { Image } from "primereact/image";

export function FooterHome(params) {
    return (
        <div className="container-fluid bg-footer pt-4 pb-4">
            <div className="container">
                <div className="row">
                    <div className="col col-12 col-md-4">
                        <Image src={"/logo.jpg"} width={"96px"} height={"40px"} />
                        <p className="text-gray-2">Descubre tu fuerza interior con nosotras. Arte, fitness y comunidad en un solo lugar.</p>
                    </div>
                    <div className="col col-12 col-md-4 text-gray-2">
                        <p className="text-white">Enlaces Rápidos</p>
                        <p>Inicio</p>
                        <p>Disciplinas</p>
                        <p>Horarios</p>
                        <p>Contacto</p>
                    </div>
                    <div className="col col-12 col-md-4">
                        <p className="text-white">Síguenos</p>
                        <Avatar icon="pi pi-instagram" size="large" className="bg-dual-2 text-white" shape="circle" />
                        <Avatar icon="pi pi-facebook" size="large" className="bg-dual-2 text-white ms-2" shape="circle" />
                    </div>
                </div>
                <hr className="text-gray-2"/>
                <p className="text-gray-2 text-center">© 2026 DUAL Pole & Aerial Studio. Todos los derechos reservados.</p>
            </div>
        </div>
    )
}