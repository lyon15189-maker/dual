import { Dialog } from "primereact/dialog";

export default function Modal({ children, data, control }) {
    // console.log(data);
    return (
        <Dialog className={data.class} header={data.header} visible={data.activar} style={data.style} footer={data?.footer} onHide={() => { if (!data.activar) return; control({ ...data, activar: false }); }}>
            {children}
        </Dialog>
    )
}