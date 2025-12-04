import { useRef, useState } from 'react'
import Equipo from './Equipo'

function Planta({ planta, onMoverEquipo, onActualizarPosicion }) {
  const plantaRef = useRef(null)
  const [dragOverPosition, setDragOverPosition] = useState(null)

  const ocupacionActual = planta.equipos.reduce((sum, e) => sum + e.ocupacion, 0)
  const porcentajeOcupacion = (ocupacionActual / planta.capacidad) * 100

  const handleDragOver = (e) => {
    e.preventDefault()

    // Calcular la posición relativa dentro de la planta
    const rect = plantaRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    setDragOverPosition(x)
  }

  const handleDragLeave = () => {
    setDragOverPosition(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOverPosition(null)

    const equipoId = e.dataTransfer.getData('equipoId')
    const origenPlantaId = e.dataTransfer.getData('origenPlantaId')

    // Calcular la posición donde se soltó
    const rect = plantaRef.current.getBoundingClientRect()
    const posicionX = e.clientX - rect.left

    // Verificar colisiones antes de mover
    if (origenPlantaId !== planta.id) {
      // Es un movimiento nuevo a esta planta
      const equipoData = e.dataTransfer.getData('equipoData')
      if (equipoData) {
        const equipo = JSON.parse(equipoData)
        if (verificarColision(posicionX, equipo.ocupacion, equipoId)) {
          alert('No se puede colocar el equipo aquí, se superpone con otro equipo')
          return
        }
      }
    }

    onMoverEquipo(equipoId, origenPlantaId, planta.id, posicionX)
  }

  // Verificar si hay colisión con otros equipos
  const verificarColision = (nuevaPosicionX, ocupacion, equipoIdMoviendo) => {
    const anchoEquipo = (ocupacion / planta.capacidad) * 100 // Porcentaje del ancho
    const anchoPlanta = plantaRef.current?.offsetWidth || 0
    const anchoEquipoPx = (anchoEquipo / 100) * anchoPlanta

    const nuevoInicio = nuevaPosicionX
    const nuevoFin = nuevaPosicionX + anchoEquipoPx

    for (let equipo of planta.equipos) {
      if (equipo.id === equipoIdMoviendo) continue // No verificar contra sí mismo

      const equipoAnchoEquipo = (equipo.ocupacion / planta.capacidad) * 100
      const equipoAnchoEquipoPx = (equipoAnchoEquipo / 100) * anchoPlanta
      const equipoInicio = equipo.posicionX
      const equipoFin = equipo.posicionX + equipoAnchoEquipoPx

      // Verificar superposición
      if (!(nuevoFin <= equipoInicio || nuevoInicio >= equipoFin)) {
        return true // Hay colisión
      }
    }

    return false // No hay colisión
  }

  return (
    <div
      ref={plantaRef}
      className="planta"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="planta-info">
        <span className="planta-numero">Planta {planta.numero}</span>
        <span className="planta-capacidad">
          {ocupacionActual}/{planta.capacidad} puestos
        </span>
      </div>

      <div className="planta-contenido">
        {dragOverPosition !== null && (
          <div
            className="drag-indicator"
            style={{ left: `${dragOverPosition}px` }}
          />
        )}

        {planta.equipos.map(equipo => (
          <Equipo
            key={equipo.id}
            equipo={equipo}
            plantaId={planta.id}
            plantaCapacidad={planta.capacidad}
            plantaRef={plantaRef}
            onActualizarPosicion={onActualizarPosicion}
            verificarColision={verificarColision}
          />
        ))}
      </div>

      <div className="planta-barra-capacidad">
        <div
          className="planta-barra-ocupacion"
          style={{
            width: `${Math.min(porcentajeOcupacion, 100)}%`,
            backgroundColor: porcentajeOcupacion > 100 ? '#f44336' :
                           porcentajeOcupacion > 80 ? '#ff9800' : '#4caf50'
          }}
        />
      </div>
    </div>
  )
}

export default Planta
