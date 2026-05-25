import React from 'react';
import { Galleria } from 'primereact/galleria';

export default function Carrusel({ imagenes = [] }) {
    const responsiveOptions = [
        {
            breakpoint: '991px',
            numVisible: 4
        },
        {
            breakpoint: '767px',
            numVisible: 3
        },
        {
            breakpoint: '575px',
            numVisible: 1
        }
    ];

    const itemTemplate = (imagen) => (
        <img
            src={imagen}
            alt="Producto"
            style={{
                width: '100%',
                display: 'block',
                objectFit: 'cover',
                height:"400px"
            }}
        />
    );

    const thumbnailTemplate = (imagen) => (
        <img
            src={imagen}
            alt="Miniatura"
            style={{
                width: '100px',
                height:'60px',
                display: 'block',
                objectFit: 'cover'
            }}
        />
    );

    return (
        <div className="card">
            <Galleria
                value={imagenes}
                responsiveOptions={responsiveOptions}
                numVisible={5}
                circular
                style={{ maxWidth: '500px' }}
                showItemNavigators
                showItemNavigatorsOnHover
                item={itemTemplate}
                thumbnail={thumbnailTemplate}
            />
        </div>
    );
}