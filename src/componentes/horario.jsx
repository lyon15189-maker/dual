"use client";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { useState } from 'react';
const Horarios1 = [
    { dia: "Lunes", clases: [{ hora: "17:00", clase: "Yoga" }, { hora: "18:15", clase: "Pole fitnnes" }, { hora: "20:15", clase: "Twerk" },] },
    { dia: "Martes", clases: [{ hora: "09:00", clase: "Acrobacia en tela" }, { hora: "18:15", clase: "Hammok / Acrobacia en tela" }, { hora: "20:00", clase: "Acrobacia en tela" },] },
    { dia: "Miercoles", clases: [{ hora: "16:00", clase: "Pole exotic" }, { hora: "17:45", clase: "Yoga con pelota" }] },
    { dia: "Jueves", clases: [{ hora: "16:30", clase: "Aerial kids" }, { hora: "18:15", clase: "Acrobacia en tela" }, { hora: "20:00", clase: "Acrobacia en tela" },] },
    { dia: "Viernes", clases: [{ hora: "08:30", clase: "Yoga" }, { hora: "09:45", clase: "Acrobacia en tela / Aro aereo" }, { hora: "16:30", clase: "Aerial kids" }, { hora: "18:15", clase: "Pole fitnnes" },] },
    { dia: "Sabado", clases: [{ hora: "08:30", clase: "Pole fitnnes" }, { hora: "10:15", clase: "Hells" }, { hora: "11:30", clase: "Yoga flow" }] },
    { dia: "Domingo", clases: [{ hora: "08:00", clase: "Poles fitnnes" }, { hora: "09:45", clase: "Pole exotic" }, { hora: "11:15", clase: "Acrobacia en tela / Aro aereo" },] },
]
const Horario = [
    {
        lunes: "Yoga\n17:00",
        martes: "Acrobacia en tela\n09:00",
        miercoles: "Pole exotic\n16:00",
        jueves: "Aerial kids\n16:30",
        viernes: "Yoga\n08:30",
        sabado: "Pole fitnnes\n08:30",
        domingo: "Poles fitnnes\n08:00"
    },
    {
        lunes: "Pole fitnnes\n18:15",
        martes: "Hammok / Acrobacia en tela\n18:15",
        miercoles: "Yoga con pelota\n17:45",
        jueves: "Acrobacia en tela\n18:15",
        viernes: "Acrobacia en tela / Aro aereo\n09:45",
        sabado: "Hells\n10:15",
        domingo: "Pole exotic\n09:45"
    },
    {
        lunes: "Twerk\n20:15",
        martes: "Acrobacia en tela\n20:00",
        miercoles: "",
        jueves: "Acrobacia en tela\n20:00",
        viernes: "Aerial kids\n16:30",
        sabado: "Yoga flow\n11:30",
        domingo: "Acrobacia en tela / Aro aereo\n11:15"
    },
    {
        lunes: "",
        martes: "",
        miercoles: "",
        jueves: "",
        viernes: "Pole fitnnes\n18:15",
        sabado: "",
        domingo: ""
    }
];


export default function HorarioHome(params) {
    // const [expandedRows, setExpandedRows] = useState(null);

    const cellTemplate = (value) => {
        if (!value) return null;

        const [clase, hora] = value.split('\n');

        return (
            <div className="celda-clase">
                <div className="nombre">{clase}</div>
                <div className="hora">{hora}</div>
            </div>
        );
    };
    return (
        <div>
            <DataTable
                value={Horario}
                stripedRows
                className="p-datatable-sm horario-table horario-home"
                tableStyle={{ tableLayout: 'fixed', width: '100%' }}
            // dataKey="dia"
            >
                <Column header="Lunes" style={{ width: '14.28%', textAlign: 'center' }} headerStyle={{ textAlign: 'center' }} body={(row) => cellTemplate(row.lunes)} />
                <Column field="Martes" header="Martes" style={{ width: '14.28%', textAlign: 'center' }} headerStyle={{ textAlign: 'center' }} body={(row) => cellTemplate(row.martes)} />
                <Column field="Miercoles" header="Miércoles" style={{ width: '14.28%', textAlign: 'center' }} headerStyle={{ textAlign: 'center' }} body={(row) => cellTemplate(row.miercoles)} />
                <Column field="Jueves" header="Jueves" style={{ width: '14.28%', textAlign: 'center' }} headerStyle={{ textAlign: 'center' }} body={(row) => cellTemplate(row.jueves)} />
                <Column field="Viernes" header="Viernes" style={{ width: '14.28%', textAlign: 'center' }} headerStyle={{ textAlign: 'center' }} body={(row) => cellTemplate(row.viernes)} />
                <Column field="Sabado" header="Sábado" style={{ width: '14.28%', textAlign: 'center' }} headerStyle={{ textAlign: 'center' }} body={(row) => cellTemplate(row.sabado)} />
                <Column field="Domingo" header="Domingo" style={{ width: '14.28%', textAlign: 'center' }} headerStyle={{ textAlign: 'center' }} body={(row) => cellTemplate(row.domingo)} />
            </DataTable>


        </div>
    )
}