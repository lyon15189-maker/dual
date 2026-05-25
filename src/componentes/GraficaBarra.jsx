"use client";

import React from "react";
import { Chart } from "primereact/chart";

export default function GraficasBarras({
    ingresosPorMetodoPago = {}
}) {
    // console.log("9", ingresosPorMetodoPago);

    // =====================================
    // VALIDAR DATA
    // =====================================
    const labels = Object.keys(
        ingresosPorMetodoPago || {}
    );

    if (labels.length === 0) {

        return (
            <div className="p-4 text-center">
                Sin información
            </div>
        );

    }

    // =====================================
    // TOTALES
    // =====================================
    const totales = labels.map(
        (metodo) =>
            ingresosPorMetodoPago?.[metodo]?.total || 0
    );

    // =====================================
    // CANTIDADES
    // =====================================
    const cantidades = labels.map(
        (metodo) =>
            ingresosPorMetodoPago?.[metodo]?.cantidad || 0
    );

    // =====================================
    // DATA
    // =====================================
    const chartData = {

        labels,

        datasets: [

            {
                label: "Ingresos",

                data: totales,

                backgroundColor: [
                    "#42A5F5",
                    "#66BB6A",
                    "#FFA726",
                    "#AB47BC",
                    "#EF5350"
                ]
            },

            {
                label: "Transacciones",

                data: cantidades,

                backgroundColor: [
                    "#26C6DA",
                    "#EC407A",
                    "#FF7043",
                    "#7E57C2",
                    "#8D6E63"
                ]
            }

        ]

    };

    // =====================================
    // OPTIONS
    // =====================================
    const chartOptions = {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {
                position: "bottom"
            }

        },

        scales: {

            y: {
                beginAtZero: true
            }

        }

    };

    return (

        <div
            className="w-100"
            style={{
                height: "400px"
            }}
        >

            <Chart
                type="bar"
                data={chartData}
                options={chartOptions}
                style={{
                    width: "100%",
                    height: "100%"
                }}
            />

        </div>

    );

}