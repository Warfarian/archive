import { useEffect, useRef, useState } from 'react'
import { Game } from 'phaser'
import { gameConfig } from './game/config'
import './App.css'
import { Jukebox } from './components/Jukebox'
import { LoadingSpinner } from './components/LoadingSpinner'
import { EndShiftButton } from './components/EndShiftButton'
import { ScoreDisplay } from './components/ScoreDisplay'

function App() {
  const [score, setScore] = useState(0)
  const [patronsServed, setPatronsServed] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [shiftEnded, setShiftEnded] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const gameRef = useRef<HTMLDivElement>(null)
  const phaserGameRef = useRef<Game | null>(null)

  useEffect(() => {
    if (gameRef.current && !phaserGameRef.current) {
      phaserGameRef.current = new Game({
        ...gameConfig,
        parent: gameRef.current
      })
      
      // Listen for game events
      phaserGameRef.current.events.on('scoreUpdate', (newScore: number) => {
        setScore(prevScore => prevScore + newScore)
        setPatronsServed(prev => prev + 1)
      })
      
      phaserGameRef.current.events.on('loadingStart', () => {
        setIsLoading(true)
      })
      
      phaserGameRef.current.events.on('loadingComplete', () => {
        setIsLoading(false)
      })
      
      phaserGameRef.current.events.on('gameStarted', () => {
        setGameStarted(true)
      })
    }

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true)
        phaserGameRef.current = null
      }
    }
  }, [])

  // Update sound state in Phaser without restarting the scene
  useEffect(() => {
    if (phaserGameRef.current && gameStarted) {
      const scene = phaserGameRef.current.scene.getScene('BarScene')
      if (scene && scene.scene.isActive()) {
        // Update sound state without restarting
        scene.data.set('soundEnabled', soundEnabled)
      }
    }
  }, [soundEnabled, gameStarted])

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
    // Play select sound when toggling
    if (!soundEnabled) {
      const selectAudio = new Audio('assets/sounds/effects/select.mp3')
      selectAudio.volume = 0.5
      selectAudio.play().catch(console.error)
    }
  }

  const handleEndShift = () => {
    setShiftEnded(true)
    // Pause the game
    if (phaserGameRef.current) {
      const scene = phaserGameRef.current.scene.getScene('BarScene')
      if (scene) {
        scene.scene.pause()
      }
    }
  }

  const handleRestart = () => {
    setScore(0)
    setPatronsServed(0)
    setShiftEnded(false)
    setGameStarted(false)
    
    // Restart the game
    if (phaserGameRef.current) {
      const scene = phaserGameRef.current.scene.getScene('BarScene')
      if (scene) {
        scene.scene.restart({ soundEnabled })
      }
    }
  }

  return (
    <div className="app">
      <div className="game-container" ref={gameRef} />
      
      {isLoading && (
        <LoadingSpinner message="Preparing questions for patrons..." />
      )}
      
      {shiftEnded && (
        <ScoreDisplay 
          score={score}
          patronsServed={patronsServed}
          onRestart={handleRestart}
        />
      )}
      
      <div className="ui-overlay">
        <div className="score-display">
          Score: {score} | Patrons: {patronsServed}
        </div>
        
        <EndShiftButton 
          onEndShift={handleEndShift}
          isVisible={gameStarted && !shiftEnded}
        />
        
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
