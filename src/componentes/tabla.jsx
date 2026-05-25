"use client";
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function TablaPlanes({planes}) {
    // const [products, setProducts] = useState([]);


    return (
        <div className="card">
            <DataTable value={planes} stripedRows >
                <Column field="paquete" header="Paquete"></Column>
                <Column field="normal" header="Precio normal"></Column>
                <Column field="pronto" header="Pronto pago"></Column>
            </DataTable>
        </div>
    );
}
