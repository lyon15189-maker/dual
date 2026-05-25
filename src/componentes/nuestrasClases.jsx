import { LinkImagen } from "./linkImagen";

export function NuestrasClases(params) {
    return (
        <div>
            <div className="contenedor-1" id="clases">
                <span className="pi pi-bookmark me-2"></span>
                Nuestras Disciplinas
            </div>
            <div className="text-center">
                <strong className="fz-60">Encuentra tu Pasión</strong>
                <p className="fz-18 text-gray">Ofrecemos una variedad de disciplinas para todos los niveles. Desde<br /> principiantes hasta avanzadas, hay un lugar para ti.</p>
            </div>
            <div className="row" style={{}}>
                <div className="col col-12 col-md-6">
                    <LinkImagen data={{ style: { backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("/fitnnes/fitnnes1.jpg")', height: "525px", width: "100%" }, titulo: "Pole Fitness", descripcion: "Fuerza, flexibilidad y arte combinados en el tubo." }} />
                </div>
                <div className="col col-12 col-md-6">
                    <LinkImagen data={{ style: { backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("/exotic/ex1.jpg")', height: "250px", width: "100%" }, titulo: "Pole Exotic", descripcion: "Sensualidad y expresión artística en movimiento." }} />
                    <div className="mt-4">
                        <LinkImagen data={{ style: { backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("/telas/telas1.jpg")', height: "250px", width: "100%" }, titulo: "Telas Aéreas", descripcion: "Vuela alto con elegancia y gracia." }} />
                    </div>
                </div>
                <div className="col col-12 col-md-3">
                    <LinkImagen data={{ style: { backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("/aro/aro1.jpg")', height: "250px", width: "100%" }, titulo: "Aro Aéreo", descripcion: "Figuras dinámicas y giros en el aire." }} />
                </div>
                <div className="col col-12 col-md-3">
                    <LinkImagen data={{ style: { backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("/yoga/yoga1.jpg")', height: "250px", width: "100%" }, titulo: "Yoga", descripcion: "Restaura el equilibrio y flexibilidad." }} />
                </div>
                <div className="col col-12 col-md-3">
                    <LinkImagen data={{ style: { backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("/twerk.jpg")', height: "250px", width: "100%" }, titulo: "Twerk", descripcion: "Ritmo, energía y diversión sin límites." }} />
                </div>
                <div className="col col-12 col-md-3">
                    <LinkImagen data={{ style: { backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("/heels.jpeg")', height: "250px", width: "100%" }, titulo: "Heels", descripcion: "Confianza y estilo sobre tacones." }} />
                </div>
            </div>
        </div>
    )
}