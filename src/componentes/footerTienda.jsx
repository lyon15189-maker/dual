import { Avatar } from "primereact/avatar";
import { Image } from "primereact/image";

export function FooterTienda(params) {
    return (
        <div className="container-fluid bg-footer bg-dark pt-4 pb-4">
            <div className="container">
                <div className="row">
                    <div className="col col-12 col-md-4">
                        <Image src={"/logo.jpg"} width={"96px"} height={"40px"} />
                        <p className="text-gray-2">DUAL Pole & Aerial Studio - Tu destino para equipamiento y ropa de alta calidad para pole dance, telas aéreas, aro aéreo, yoga y más.</p>
                        <Avatar icon="pi pi-instagram" size="large" className="bg-dual-2 text-white" shape="circle" />
                        <Avatar icon="pi pi-facebook" size="large" className="bg-dual-2 text-white ms-2" shape="circle" />
                    </div>
                    <div className="col col-12 col-md-4 text-gray-2">
                        <p className="text-white">Enlaces</p>
                        <p>Catálogo</p>
                        <p>Ropa deportiva</p>
                        <p>Equipamento</p>
                        
                    </div>
                    <div className="col col-12 col-md-4 text-gray-2">
                        <p className="text-white">Contacto</p>
                        <p>info@dual.studio</p>
                        <p>WhatsApp: +1 234 567 890</p>
                    </div>
                </div>
                <hr className="text-gray-2"/>
                <p className="text-gray-2 text-center">© 2026 DUAL Pole & Aerial Studio. Todos los derechos reservados.</p>
            </div>
        </div>
    )
}