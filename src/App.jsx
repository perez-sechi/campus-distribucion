import { useState } from 'react'
import Campus from './components/Campus'
import ChatInterface from './components/ChatInterface'

function App() {
  // Datos iniciales del campus
  const [edificios, setEdificios] = useState([
    {
      id: 'edificio-1',
      nombre: 'Edificio A',
      plantas: [
        { id: 'e1-p1', numero: 1, capacidad: 100, equipos: [] },
        { id: 'e1-p2', numero: 2, capacidad: 120, equipos: [] },
        { id: 'e1-p3', numero: 3, capacidad: 100, equipos: [] },
        { id: 'e1-p4', numero: 4, capacidad: 80, equipos: [] },
      ]
    },
    {
      id: 'edificio-2',
      nombre: 'Edificio B',
      plantas: [
        { id: 'e2-p1', numero: 1, capacidad: 90, equipos: [] },
        { id: 'e2-p2', numero: 2, capacidad: 90, equipos: [] },
        { id: 'e2-p3', numero: 3, capacidad: 110, equipos: [] },
      ]
    },
    {
      id: 'edificio-3',
      nombre: 'Edificio C',
      plantas: [
        { id: 'e3-p1', numero: 1, capacidad: 150, equipos: [] },
        { id: 'e3-p2', numero: 2, capacidad: 150, equipos: [] },
        { id: 'e3-p3', numero: 3, capacidad: 130, equipos: [] },
        { id: 'e3-p4', numero: 4, capacidad: 130, equipos: [] },
        { id: 'e3-p5', numero: 5, capacidad: 100, equipos: [] },
      ]
    }
  ])

  // Equipos disponibles sin asignar
  const [equiposDisponibles, setEquiposDisponibles] = useState([
    { id: 'equipo-1', nombre: 'Marketing', ocupacion: 25, color: '#FF6B6B' },
    { id: 'equipo-2', nombre: 'Desarrollo', ocupacion: 45, color: '#4ECDC4' },
    { id: 'equipo-3', nombre: 'Diseño', ocupacion: 15, color: '#FFE66D' },
    { id: 'equipo-4', nombre: 'Recursos Humanos', ocupacion: 20, color: '#95E1D3' },
    { id: 'equipo-5', nombre: 'Finanzas', ocupacion: 30, color: '#F38181' },
    { id: 'equipo-6', nombre: 'Ventas', ocupacion: 35, color: '#AA96DA' },
    { id: 'equipo-7', nombre: 'IT Support', ocupacion: 18, color: '#FCBAD3' },
    { id: 'equipo-8', nombre: 'Legal', ocupacion: 12, color: '#A8D8EA' },
  ])

  // Función para mover un equipo entre plantas o desde/hacia disponibles
  const moverEquipo = (equipoId, origenPlantaId, destinoPlantaId, posicionX) => {
    // Actualizar edificios primero
    setEdificios(prevEdificios => {
      const nuevosEdificios = JSON.parse(JSON.stringify(prevEdificios))
      let equipoMovido = null

      // Si viene de equipos disponibles
      if (origenPlantaId === 'disponibles') {
        // Buscar en disponibles usando el estado actual (closure)
        equipoMovido = equiposDisponibles.find(e => e.id === equipoId)
        if (!equipoMovido) return prevEdificios
      } else {
        // Buscar y remover el equipo de su planta de origen
        for (let edificio of nuevosEdificios) {
          const plantaOrigen = edificio.plantas.find(p => p.id === origenPlantaId)
          if (plantaOrigen) {
            const index = plantaOrigen.equipos.findIndex(e => e.id === equipoId)
            if (index !== -1) {
              equipoMovido = plantaOrigen.equipos[index]
              plantaOrigen.equipos.splice(index, 1)
              break
            }
          }
        }
      }

      if (!equipoMovido) return prevEdificios

      // Si el destino es disponibles, manejar más tarde
      if (destinoPlantaId === 'disponibles') {
        // Actualizar disponibles después
        setEquiposDisponibles(prev => {
          // Verificar si ya existe
          if (!prev.find(e => e.id === equipoMovido.id)) {
            return [...prev, equipoMovido]
          }
          return prev
        })
        return nuevosEdificios
      }

      // Buscar la planta de destino y agregar el equipo
      for (let edificio of nuevosEdificios) {
        const plantaDestino = edificio.plantas.find(p => p.id === destinoPlantaId)
        if (plantaDestino) {
          // Calcular ocupación actual
          const ocupacionActual = plantaDestino.equipos.reduce((sum, e) => sum + e.ocupacion, 0)

          // Verificar si hay capacidad
          if (ocupacionActual + equipoMovido.ocupacion <= plantaDestino.capacidad) {
            // Agregar el equipo con su posición
            plantaDestino.equipos.push({
              ...equipoMovido,
              posicionX: posicionX
            })

            // COMPACTAR: Reordenar todos los equipos desde el inicio
            compactarEquiposEnPlanta(plantaDestino)

            // Si vino de disponibles, removerlo de ahí
            if (origenPlantaId === 'disponibles') {
              setEquiposDisponibles(prev => prev.filter(e => e.id !== equipoId))
            }
          } else {
            // No hay capacidad, devolver el equipo a disponibles
            setEquiposDisponibles(prev => {
              if (!prev.find(e => e.id === equipoMovido.id)) {
                return [...prev, equipoMovido]
              }
              return prev
            })
            alert(`No hay suficiente capacidad en la planta. Capacidad: ${plantaDestino.capacidad}, Ocupación actual: ${ocupacionActual}, Se necesita: ${equipoMovido.ocupacion}`)
          }
          break
        }
      }

      // Compactar también la planta de origen si un equipo fue removido
      if (origenPlantaId !== 'disponibles') {
        for (let edificio of nuevosEdificios) {
          const plantaOrigen = edificio.plantas.find(p => p.id === origenPlantaId)
          if (plantaOrigen) {
            compactarEquiposEnPlanta(plantaOrigen)
            break
          }
        }
      }

      return nuevosEdificios
    })
  }

  // Función para actualizar la posición de un equipo dentro de una planta
  const actualizarPosicionEquipo = (equipoId, plantaId, nuevaPosicionX) => {
    setEdificios(prevEdificios => {
      const nuevosEdificios = JSON.parse(JSON.stringify(prevEdificios))

      for (let edificio of nuevosEdificios) {
        const planta = edificio.plantas.find(p => p.id === plantaId)
        if (planta) {
          const equipo = planta.equipos.find(e => e.id === equipoId)
          if (equipo) {
            equipo.posicionX = nuevaPosicionX
          }
          break
        }
      }

      return nuevosEdificios
    })
  }

  // Funciones para ejecutar acciones desde el chat con Gemini
  const handleExecuteAction = async (functionName, args) => {
    switch (functionName) {
      case 'moverEquipoAPlanta':
        return moverEquipoAPlantaPorNombre(args.nombreEquipo, args.nombreEdificio, args.numeroPlanta)

      case 'moverEquipoADisponibles':
        return moverEquipoADisponiblesPorNombre(args.nombreEquipo)

      case 'obtenerEstadoCampus':
        return obtenerEstadoCampus()

      case 'distribuirEquiposAutomaticamente':
        return distribuirEquiposAutomaticamente(args.criterio || 'balanceado')

      case 'vaciarPlanta':
        return vaciarPlantaPorNombre(args.nombreEdificio, args.numeroPlanta)

      case 'vaciarEdificio':
        return vaciarEdificioPorNombre(args.nombreEdificio)

      default:
        return { success: false, message: `Función desconocida: ${functionName}` }
    }
  }

  // Función auxiliar para calcular una posición libre en una planta
  // Los equipos se colocan siempre desde el inicio, uno al lado del otro, SIN espacios
  const calcularPosicionLibre = (planta, ocupacionNuevoEquipo, anchoPlantaPx = 400) => {
    if (planta.equipos.length === 0) {
      return 0 // Empezar desde el inicio (posición 0)
    }

    // Calcular la posición final del último equipo
    // El ancho del equipo es un porcentaje que se aplica al ancho real de la planta en píxeles
    let posicionFinalMaxima = 0

    planta.equipos.forEach(equipo => {
      const anchoPorcentaje = (equipo.ocupacion / planta.capacidad) * 100
      const anchoEquipoPx = (anchoPorcentaje / 100) * anchoPlantaPx
      const finEquipo = equipo.posicionX + anchoEquipoPx
      if (finEquipo > posicionFinalMaxima) {
        posicionFinalMaxima = finEquipo
      }
    })

    // Colocar el nuevo equipo inmediatamente después del último (sin margen)
    return posicionFinalMaxima
  }

  // Función para compactar todos los equipos de una planta desde el inicio
  // Los equipos quedan completamente pegados, sin espacios entre ellos
  const compactarEquiposEnPlanta = (planta, anchoPlantaPx = 400) => {
    if (planta.equipos.length === 0) return

    let posicionActual = 0 // Empezar desde el principio

    // Ordenar equipos por posición actual para mantener el orden visual
    const equiposOrdenados = [...planta.equipos].sort((a, b) => a.posicionX - b.posicionX)

    // Reposicionar cada equipo desde el inicio, completamente pegados
    equiposOrdenados.forEach(equipo => {
      equipo.posicionX = posicionActual
      // Calcular ancho en píxeles (el componente Equipo usa width en %)
      const anchoPorcentaje = (equipo.ocupacion / planta.capacidad) * 100
      const anchoEquipoPx = (anchoPorcentaje / 100) * anchoPlantaPx
      posicionActual += anchoEquipoPx // Sin margen, completamente pegados
    })
  }

  // Implementación de funciones llamables desde Gemini
  const moverEquipoAPlantaPorNombre = (nombreEquipo, nombreEdificio, numeroPlanta) => {
    // Buscar el equipo (puede estar en disponibles o en alguna planta)
    let equipoEncontrado = equiposDisponibles.find(e =>
      e.nombre.toLowerCase() === nombreEquipo.toLowerCase()
    )
    let origenPlantaId = 'disponibles'

    if (!equipoEncontrado) {
      // Buscar en las plantas
      for (let edificio of edificios) {
        for (let planta of edificio.plantas) {
          const equipo = planta.equipos.find(e =>
            e.nombre.toLowerCase() === nombreEquipo.toLowerCase()
          )
          if (equipo) {
            equipoEncontrado = equipo
            origenPlantaId = planta.id
            break
          }
        }
        if (equipoEncontrado) break
      }
    }

    if (!equipoEncontrado) {
      return { success: false, message: `No se encontró el equipo "${nombreEquipo}"` }
    }

    // Buscar el edificio y la planta de destino
    const edificio = edificios.find(e =>
      e.nombre.toLowerCase() === nombreEdificio.toLowerCase()
    )

    if (!edificio) {
      return { success: false, message: `No se encontró el edificio "${nombreEdificio}"` }
    }

    const planta = edificio.plantas.find(p => p.numero === numeroPlanta)

    if (!planta) {
      return { success: false, message: `No se encontró la planta ${numeroPlanta} en ${nombreEdificio}` }
    }

    // Calcular posición libre automáticamente
    const posicionLibre = calcularPosicionLibre(planta, equipoEncontrado.ocupacion)

    // Mover el equipo
    moverEquipo(equipoEncontrado.id, origenPlantaId, planta.id, posicionLibre)

    return {
      success: true,
      message: `Equipo "${nombreEquipo}" movido a ${nombreEdificio}, Planta ${numeroPlanta}`
    }
  }

  const moverEquipoADisponiblesPorNombre = (nombreEquipo) => {
    // Buscar el equipo en las plantas
    let equipoEncontrado = null
    let origenPlantaId = null

    for (let edificio of edificios) {
      for (let planta of edificio.plantas) {
        const equipo = planta.equipos.find(e =>
          e.nombre.toLowerCase() === nombreEquipo.toLowerCase()
        )
        if (equipo) {
          equipoEncontrado = equipo
          origenPlantaId = planta.id
          break
        }
      }
      if (equipoEncontrado) break
    }

    if (!equipoEncontrado) {
      return { success: false, message: `El equipo "${nombreEquipo}" no está en ninguna planta` }
    }

    moverEquipo(equipoEncontrado.id, origenPlantaId, 'disponibles', 0)

    return {
      success: true,
      message: `Equipo "${nombreEquipo}" devuelto a disponibles`
    }
  }

  const obtenerEstadoCampus = () => {
    const info = {
      edificios: edificios.map(ed => ({
        nombre: ed.nombre,
        plantas: ed.plantas.map(p => ({
          numero: p.numero,
          capacidad: p.capacidad,
          ocupacion: p.equipos.reduce((sum, e) => sum + e.ocupacion, 0),
          equipos: p.equipos.map(e => ({ nombre: e.nombre, ocupacion: e.ocupacion }))
        }))
      })),
      equiposDisponibles: equiposDisponibles.map(e => ({ nombre: e.nombre, ocupacion: e.ocupacion }))
    }

    return {
      success: true,
      data: info,
      message: 'Estado del campus obtenido correctamente'
    }
  }

  const distribuirEquiposAutomaticamente = (criterio) => {
    if (equiposDisponibles.length === 0) {
      return { success: false, message: 'No hay equipos disponibles para distribuir' }
    }

    const equiposParaDistribuir = [...equiposDisponibles]
    let equiposColocados = 0

    if (criterio === 'balanceado') {
      // Distribuir equitativamente en todas las plantas
      for (let equipo of equiposParaDistribuir) {
        let colocado = false

        for (let edificio of edificios) {
          for (let planta of edificio.plantas) {
            const ocupacionActual = planta.equipos.reduce((sum, e) => sum + e.ocupacion, 0)
            if (ocupacionActual + equipo.ocupacion <= planta.capacidad) {
              const posicionLibre = calcularPosicionLibre(planta, equipo.ocupacion)
              moverEquipo(equipo.id, 'disponibles', planta.id, posicionLibre)
              equiposColocados++
              colocado = true
              break
            }
          }
          if (colocado) break
        }
      }
    } else if (criterio === 'llenar_primero') {
      // Llenar edificios y plantas de forma secuencial
      for (let equipo of equiposParaDistribuir) {
        let colocado = false

        for (let edificio of edificios) {
          for (let planta of edificio.plantas) {
            const ocupacionActual = planta.equipos.reduce((sum, e) => sum + e.ocupacion, 0)
            if (ocupacionActual + equipo.ocupacion <= planta.capacidad) {
              const posicionLibre = calcularPosicionLibre(planta, equipo.ocupacion)
              moverEquipo(equipo.id, 'disponibles', planta.id, posicionLibre)
              equiposColocados++
              colocado = true
              break
            }
          }
          if (colocado) break
        }
      }
    }

    return {
      success: true,
      message: `${equiposColocados} equipos distribuidos usando criterio "${criterio}"`
    }
  }

  const vaciarPlantaPorNombre = (nombreEdificio, numeroPlanta) => {
    const edificio = edificios.find(e =>
      e.nombre.toLowerCase() === nombreEdificio.toLowerCase()
    )

    if (!edificio) {
      return { success: false, message: `No se encontró el edificio "${nombreEdificio}"` }
    }

    const planta = edificio.plantas.find(p => p.numero === numeroPlanta)

    if (!planta) {
      return { success: false, message: `No se encontró la planta ${numeroPlanta}` }
    }

    const equiposAMover = [...planta.equipos]

    for (let equipo of equiposAMover) {
      moverEquipo(equipo.id, planta.id, 'disponibles', 0)
    }

    return {
      success: true,
      message: `Planta ${numeroPlanta} de ${nombreEdificio} vaciada (${equiposAMover.length} equipos)`
    }
  }

  const vaciarEdificioPorNombre = (nombreEdificio) => {
    const edificio = edificios.find(e =>
      e.nombre.toLowerCase() === nombreEdificio.toLowerCase()
    )

    if (!edificio) {
      return { success: false, message: `No se encontró el edificio "${nombreEdificio}"` }
    }

    let totalEquipos = 0

    for (let planta of edificio.plantas) {
      const equiposAMover = [...planta.equipos]
      totalEquipos += equiposAMover.length

      for (let equipo of equiposAMover) {
        moverEquipo(equipo.id, planta.id, 'disponibles', 0)
      }
    }

    return {
      success: true,
      message: `${nombreEdificio} vaciado completamente (${totalEquipos} equipos)`
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Distribución de Equipos - Campus</h1>
      </header>

      <div className="main-content">
        <div className="left-panel">
          <div className="equipos-disponibles">
            <h2>Equipos Disponibles</h2>
            <div className="equipos-lista">
              {equiposDisponibles.map(equipo => (
                <div
                  key={equipo.id}
                  className="equipo-disponible"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('equipoId', equipo.id)
                    e.dataTransfer.setData('origenPlantaId', 'disponibles')
                  }}
                  style={{ backgroundColor: equipo.color }}
                >
                  <div className="equipo-nombre">{equipo.nombre}</div>
                  <div className="equipo-ocupacion">{equipo.ocupacion} puestos</div>
                </div>
              ))}
            </div>
          </div>

          <ChatInterface
            edificios={edificios}
            equiposDisponibles={equiposDisponibles}
            onExecuteAction={handleExecuteAction}
          />
        </div>

        <div className="right-panel">
          <Campus
            edificios={edificios}
            onMoverEquipo={moverEquipo}
            onActualizarPosicion={actualizarPosicionEquipo}
          />
        </div>
      </div>
    </div>
  )
}

export default App
