import React, { useRef, useEffect } from 'react';
import { Toast } from 'primereact/toast';

export default function Notificacion({ mensaje }) {
    const toast = useRef(null);

    useEffect(() => {
        if (mensaje) {
            toast.current.show(mensaje);
        }
    }, [mensaje]);

    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast} />
        </div>
    );
}