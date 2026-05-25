import { IconoDescripcion } from "./iconoDescripcion";

export default function Contactanos(params) {
    return (
        <div className="bg-dual container-fuid" >
            <div className="row g-0">
                <div className="col col-12 col-md-6 p-0">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3754.008370947684!2d-99.09821002523488!3d19.797242428935814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d18d5df2bf12cd%3A0x255fd73a8f72ccf8!2sDual-Pole%20%26%20Aerial%20Studio...!5e0!3m2!1ses-419!2smx!4v1770685158299!5m2!1ses-419!2smx" width="100%" height="460" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
                <div className="col col-12 col-md-6 text-white centrar" style={{ height: '460px' }}>
                    <div className="text-center">
                        <div className="contenedor-1 mb-4" id="contactanos">
                            <span className="pi pi-comment me-2"></span>
                            Contactanos
                        </div>
                        <h3>Unete a nosotros</h3>
                        <p>Sigenos en todas nuestras redes sociales</p>
                        <div>
                            <a href='/'><span className='text-white pi pi-facebook me-2'></span></a>
                            <a href='/'> <span className='text-white pi pi-twitter me-2'></span></a>
                            <a href='/'> <span className='text-white pi pi-instagram me-2'></span></a>
                            <a href='/'> <span className='text-white pi pi-whatsapp me-2'></span></a>
                        </div>
                        <div className="container">
                            <div className="row mt-2">
                                <div className="col col-12 col-md-6">
                                    <IconoDescripcion icono={"pi pi-map-marker"} titulo={"Ubicación"} descripcion={"Calle Principal #123, Centro"} />
                                    <IconoDescripcion icono={"pi pi-phone"} titulo={"Telefono"} descripcion={"+52 123 456 7890"} />
                                </div>
                                <div className="col col-12 col-md-6">
                                    <IconoDescripcion icono={"pi pi-envelope"} titulo={"Email"} descripcion={"info@dualstudio.com"} />
                                    <IconoDescripcion icono={"pi pi-clock"} titulo={"Horario"} descripcion={"Lun - Vie: 10:00 - 20:00 Sáb: 10:00 - 13:00"} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}