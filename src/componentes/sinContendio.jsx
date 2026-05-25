import { Button } from "primereact/button";

export default function SinContenido({ icon, titulo, descripcion, btnLabel, accion }) {
    return (
        <div className="p-3 text-center m-5">
            <p className="text-gray-2"><span className={icon + " fz-60"}></span></p>
            {titulo && <p className="fz-18 text-gray-2">{titulo}</p>}
            {descripcion && <p className="fz-15 text-gray">{descripcion}</p>}
            {accion !== undefined &&
                <Button icon="pi pi-plus me-2" className="btn btn-dual br-15" onClick={() => accion ? accion() : {}}>{btnLabel}</Button>
            }
        </div>
    )
}