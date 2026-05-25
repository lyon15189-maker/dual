import { useState } from "react";
import { Button } from "primereact/button";
import { PrimeraMayuscula } from "@/js/scrips";

export default function ConfigurarArticulo({ data, control }) {

    const [activo, setActivo] = useState(0);

    return (
        <div>
            {data?.map((e, i) => {
                return (
                    <Button
                        key={"con" + i}
                        label={PrimeraMayuscula(e)}
                        severity="secondary"
                        outlined
                        onClick={() => { control == undefined ? setActivo(i) : setActivo(i), control(e) }}
                        className={`conA br-15 me-2 ${activo === i ? "conA-active" : ""}`}
                    />
                )
            })}
        </div>
    )
}