import { Avatar } from "primereact/avatar";
import { Image } from "primereact/image";

export function ImagenEtiqueta(props) {
    return (
        <div className="contenerdor-imagenEtiqueta">
            <div className="" style={{ width: "90%", height: "400px", borderRadius:"15px", overflow:"hidden" }}>
                <Image src="/banner3.jpg" height="100%" width="100%" className="img-imagenEtiqueta" />
            </div>
            <div className="card info-image">
                <div className="row">
                    <div className="col col-2">
                        <Avatar icon="pi pi-heart" size="large" className="bg-dual-2 text-white" shape="circle" />
                    </div>
                    <div className="col col-10 ">
                        <div className="d-grid ps-5">
                            <strong className="fz-24">+500</strong>
                            <span className="fz-18">Alumnas</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}