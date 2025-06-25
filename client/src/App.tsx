import { useEffect, useRef } from 'react'
import { Game } from 'phaser'
import { gameConfig } from './game/config'
import './App.css'

function App() {
  const gameRef = useRef<HTMLDivElement>(null)
  const phaserGameRef = useRef<Game | null>(null)

  useEffect(() => {
    if (gameRef.current && !phaserGameRef.current) {
      phaserGameRef.current = new Game({
        ...gameConfig,
        parent: gameRef.current
      })
    }

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true)
        phaserGameRef.current = null
      }
    }
  }, [])

  return (
    <div className="app">
      <div className="game-container" ref={gameRef} />
      <div className="ui-overlay">
        <div className="score-display">
          <span>Score: 0</span>
        </div>
      </div>
    </div>
  )
}

export default App
