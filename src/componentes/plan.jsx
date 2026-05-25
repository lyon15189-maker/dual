export default function PlanPaquete({ planData }) {
    const { clase, icon, plan, meses, anualidad } = planData
    return (
        <div className={clase}>

            <div className="plan-conteiner bg-dual-claro pb-4 card">
                <div className="text-center">
                    <div className="bg-dual text-white ms-3 me-3">
                        <span className="fs-4">{plan}</span>
                    </div>
                    <div className="row cuadro-blanco ms-3 me-3">
                        <div className="col col-4">
                            <strong>Periodo</strong>
                        </div>
                        <div className="col col-4">
                            <strong>Precio <br /> normal</strong>
                        </div>
                        <div className="col col-4">
                            <strong>Pronto <br /> Pago</strong>
                        </div>
                    </div>
                </div>
                <div className="clase-lista m-3 br-25">
                    <div className="row">
                        <div className="col col-4 text-center">
                            <small>6 Meses</small>
                        </div>
                        <div className="col col-4 text-center">
                            <strong className="text-dual-claro">${meses[0]}</strong>
                        </div>
                        <div className="col col-4 text-center">
                            <strong className="text-dual-claro">${meses[1]}</strong>
                        </div>
                    </div>
                </div>
                <div className="clase-lista m-3 br-25 ">
                    <div className="row">
                        <div className="col col-4 text-center">
                            <small>Anualidad</small>
                        </div>
                        <div className="col col-4 text-center">
                            <strong className="text-dual-claro">${anualidad[0]}</strong>
                        </div>
                        <div className="col col-4 text-center">
                            <strong className="text-dual-claro">${anualidad[1]}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}