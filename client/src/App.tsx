import { useEffect, useRef, useState } from 'react'
import { Game } from 'phaser'
import { gameConfig } from './game/config'
import './App.css'
import { Jukebox } from './components/Jukebox'

function App() {
  const [score, setScore] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(false)
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

  // Pass sound state to Phaser scene when it changes
  useEffect(() => {
    if (phaserGameRef.current) {
      const scene = phaserGameRef.current.scene.getScene('BarScene')
      if (scene) {
        scene.scene.restart({ soundEnabled })
      }
    }
  }, [soundEnabled])

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
    // Play select sound when toggling
    if (!soundEnabled) {
      const selectAudio = new Audio('assets/sounds/effects/select.mp3')
      selectAudio.volume = 0.5
      selectAudio.play().catch(console.error)
    }
  }

  return (
    <div className="app">
      <div className="game-container" ref={gameRef} />
      <div className="ui-overlay">
        <div className="score-display">
          Score: {score}
        </div>
        
        <button 
          className="sound-toggle"
          onClick={toggleSound}
          onMouseEnter={() => {
            if (soundEnabled) {
              const hoverAudio = new Audio('assets/sounds/effects/hover.mp3')
              hoverAudio.volume = 0.3
              hoverAudio.play().catch(console.error)
            }
          }}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
        
        <Jukebox isVisible={soundEnabled} />
      </div>
    </div>
  )
}

export default App
