import Planta from './Planta'

function Edificio({ edificio, onMoverEquipo, onActualizarPosicion }) {
  return (
    <div className="edificio">
      <div className="edificio-header">
        <h3>{edificio.nombre}</h3>
      </div>
      <div className="edificio-plantas">
        {edificio.plantas.slice().reverse().map(planta => (
          <Planta
            key={planta.id}
            planta={planta}
            onMoverEquipo={onMoverEquipo}
            onActualizarPosicion={onActualizarPosicion}
          />
        ))}
      </div>
    </div>
  )
}

export default Edificio
