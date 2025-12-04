import { useState, useEffect, useRef } from 'react'

function Equipo({ equipo, plantaId, plantaCapacidad, plantaRef, onActualizarPosicion, verificarColision }) {
  const equipoRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)

  // Calcular el ancho del equipo basado en su ocupación
  const anchoEquipo = (equipo.ocupacion / plantaCapacidad) * 100 // Porcentaje

  const handleDragStart = (e) => {
    setIsDragging(true)

    // Guardar el offset del mouse dentro del elemento
    const rect = equipoRef.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    setDragOffset(offsetX)

    e.dataTransfer.setData('equipoId', equipo.id)
    e.dataTransfer.setData('origenPlantaId', plantaId)
    e.dataTransfer.setData('equipoData', JSON.stringify({
      id: equipo.id,
      nombre: equipo.nombre,
      ocupacion: equipo.ocupacion,
      color: equipo.color
    }))
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // Reposicionar el equipo si está fuera de los límites o se superpone
  useEffect(() => {
    if (plantaRef.current && equipoRef.current) {
      const plantaAncho = plantaRef.current.offsetWidth
      const equipoAncho = equipoRef.current.offsetWidth
      const maxPosicion = plantaAncho - equipoAncho

      if (equipo.posicionX > maxPosicion) {
        onActualizarPosicion(equipo.id, plantaId, maxPosicion)
      }
    }
  }, [equipo.posicionX, plantaCapacidad, plantaRef, equipoRef])

  return (
    <div
      ref={equipoRef}
      className={`equipo-en-planta ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        backgroundColor: equipo.color,
        left: `${equipo.posicionX}px`,
        width: `${anchoEquipo}%`,
        minWidth: '80px'
      }}
    >
      <div className="equipo-nombre">{equipo.nombre}</div>
      <div className="equipo-ocupacion">{equipo.ocupacion}</div>
    </div>
  )
}

export default Equipo
