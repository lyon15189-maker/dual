export default function TituloAdmin({ titulo, descripcion }) {
    return (
        <div>
            <p className='fz-30 m-0'><strong>{titulo}</strong></p>
            <p className='fz-16'>{descripcion}</p>
        </div>
    )
}