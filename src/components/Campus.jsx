import Edificio from './Edificio'

function Campus({ edificios, onMoverEquipo, onActualizarPosicion }) {
  return (
    <div className="campus">
      <div className="campus-grid">
        {edificios.map(edificio => (
          <Edificio
            key={edificio.id}
            edificio={edificio}
            onMoverEquipo={onMoverEquipo}
            onActualizarPosicion={onActualizarPosicion}
          />
        ))}
      </div>
    </div>
  )
}

export default Campus
