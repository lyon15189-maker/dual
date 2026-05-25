import { LinkImagen } from "./linkImagen";

export function Categorias(params) {
    return (
        <div className="bg-negro container-fluid pt-5 pb-5">
            <div className="container">
                <div className="row">
                    <div className="col col-6">
                        <div className="text-dual" id="colecciones">Colecciones</div>
                        <h2 className="titulo-tienda text-white">Categorías</h2>
                    </div>
                    <div className="col col-6 ">
                        <div className="text-dual text-end mt-4 pointer">Ver todo <span className="ms-2 pi pi-arrow-right"></span></div>
                    </div>
                    <div className="row" style={{}}>
                        <div className="col col-12 col-md-6">
                            <LinkImagen data={{ style: { backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("/productos/p1.jpg")', height: "610px", width: "100%" }, titulo: "Ropa deportiva", descripcion: "Tops, shorts, leggings para pole y aerial", tienda: true }} />
                        </div>
                        <div className="col col-12 col-md-6">
                            <LinkImagen data={{ style: { backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("/productos/p2.jpg")', height: "300px", width: "100%" }, titulo: "Accesorios", descripcion: "Grip, rodilleras, calentadores", tienda: true }} />
                            <div className="row">
                                <div className="col col-12 col-md-6">
                                    <LinkImagen data={{ style: { backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("/productos/p6.jpg")', height: "300px", width: "100%" }, titulo: "Equipamiento    ", descripcion: "Barras de pole, aros, telas aéreas  ", tienda: true }} />
                                </div>
                                <div className="col col-12 col-md-6">
                                    <LinkImagen data={{ style: { backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("/productos/p5.jpg")', height: "300px", width: "100%" }, titulo: "Yoga & Wellness", descripcion: "Mats, bloques, accesorios de yoga", tienda: true }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}