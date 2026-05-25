export function LinkImagen({ data }) {
    return (
        <div className="contenedor-galery">
            <div className="image-galery d-grid" style={data.style}>
            </div>
            <div style={{ position: "absolute", bottom: data.tienda == undefined?"40px":"10px", left: "25px" }}>
                <strong className={data.tienda == undefined ? "fz-30 text-white" : "titulo-tienda-producto text-white"}>{data.titulo}</strong>
                <p className="text-white">{data.descripcion}</p>
                {data.tienda == undefined &&
                    <span className="galery-info">Más info <i className="pi pi-angle-right"></i></span>
                }
            </div>
        </div>
    )
}