import { Avatar } from "primereact/avatar";

export function IconoDescripcion({ icono, titulo, descripcion }) {
    return (
        <div className="row">
            <div className="col col-2">
                <Avatar icon={icono} size="large" style={{ backgroundColor: 'rgb(211 204 233 / var(--tw-bg-opacity, 1))', color: 'rgb(138 122 215 / var(--tw-text-opacity, 1))' }} shape="circle" />
            </div>
            <div className="col col-10 d-grid text-start">
                <strong>{titulo}</strong>
                <span>{descripcion}</span>
            </div>
        </div>
    )
}