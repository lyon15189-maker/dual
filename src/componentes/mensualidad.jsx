export default function Mensulidad({ data }) {
    const { titulo, duracion, clases, cantidadPrecio, descripcion } = data
    return (
        <div className="card bg-dual-claro">
            <div className="car-header text-center bg-dual text-white ms-3 me-3"><span className="fz-30">{titulo}</span><br /><span className="fz-15">{duracion}</span></div>
            <div className="car-body ms-3 me-3">
                <div className="row">
                    <div className="col col-12 col-md-6">
                        <div className="cuadro-blanco">
                            <small>Inscripcion <span className="ms-4">$300</span></small><br />
                            <small>Incluye regalo de bienvenida</small>
                        </div>
                        <div className="cuadro-blanco mt-3">
                            <h4>CLASES</h4>
                            <ul>
                                {clases.map((e, i) => {
                                    return (
                                        <li key={"clase" + i}>{e}</li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="col col-12 col-md-6">
                        {cantidadPrecio.map((a, b) => {
                            return (
                                <div className="clase-lista br-25" key={"cantidadPrecio" + b}>
                                    <div className="row">
                                        <div className="col col-md-8 p-0">{a.cantidad}</div>
                                        <div className="col col-md-4 p-0 text-dual-claro"><strong>{a.precio}</strong></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="card-footer bg-dual">
                {descripcion.map((c, d) => {
                    return (
                        <p key={"des" + d}>{c}</p>
                    )
                })}
            </div>
        </div>
    )
}