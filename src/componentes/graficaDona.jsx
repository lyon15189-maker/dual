import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

export default function GraficaDona({
    ingresosPorTipo = {}
}) {

    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {

        const documentStyle = getComputedStyle(
            document.documentElement
        );

        const labels = Object.keys(
            ingresosPorTipo
        );

        const valores = Object.values(
            ingresosPorTipo
        );

        const data = {
            labels,

            datasets: [
                {
                    data: valores,

                    backgroundColor: [
                        documentStyle.getPropertyValue("--blue-500"),
                        documentStyle.getPropertyValue("--green-500"),
                        documentStyle.getPropertyValue("--yellow-500"),
                        documentStyle.getPropertyValue("--purple-500"),
                        documentStyle.getPropertyValue("--red-500"),
                        documentStyle.getPropertyValue("--orange-500")
                    ],

                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue("--blue-400"),
                        documentStyle.getPropertyValue("--green-400"),
                        documentStyle.getPropertyValue("--yellow-400"),
                        documentStyle.getPropertyValue("--purple-400"),
                        documentStyle.getPropertyValue("--red-400"),
                        documentStyle.getPropertyValue("--orange-400")
                    ]
                }
            ]
        };

        const options = {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "60%",

            plugins: {

                legend: {
                    position: "bottom"
                }

            }

        };

        setChartData(data);

        setChartOptions(options);

    }, [ingresosPorTipo]);

    return (

        <div
            className="w-100"
            style={{
                height: "400px"
            }}
        >

            <Chart
                type="doughnut"
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