import { Avatar } from "primereact/avatar";
import { Checkbox } from "primereact/checkbox";

export default function ListadoUsuario({ item, control, data, permisos, generico }) {
    const { alumno } = item
    const texto = alumno?.nombre;
    const primerasDos = texto?.slice(0, 2);
    // console.log("8", item, data);


    return (
        <div className={`text-start br-15 ps-4 pe-4 pt-1 pb-1 ${generico == undefined ? "card card-efect" : ""}`}>
            <div className="row">
                <div className="col col-2 d-flex align-items-center">
                    {/* {item.alumno.avatar} */}
                    <Avatar label={primerasDos} className='icon-admin p-3' shape="circle" />
                </div>
                <div className="col col-9 text-start">
                    <div className="m-0 fz-15 text-gray ms-2">{texto + " " + alumno?.apellidos}</div>
                    <div className="m-0 fz-12 text-gray-2 ms-2">{alumno?.email}</div>
                </div>
                {(permisos == "admin" || permisos == "maestro") &&
                    <div className="col col-1">
                        <Checkbox inputId={"lista" + item._id} name="lista" value={item._id} onChange={control} checked={data.includes(item._id)} />
                    </div>
                }
            </div>
        </div>
    )
}