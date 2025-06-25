import React from 'react'

interface ScoreDisplayProps {
  score: number
  patronsServed: number
  onRestart: () => void
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  score, 
  patronsServed, 
  onRestart 
}) => {
  const averageScore = patronsServed > 0 ? (score / patronsServed).toFixed(1) : '0.0'
  
  return (
    <div className="final-score-overlay">
      <div className="final-score-container">
        <div className="final-score-header">SHIFT COMPLETE</div>
        
        <div className="final-score-stats">
          <div className="score-stat">
            <span className="stat-label">TOTAL SCORE:</span>
            <span className="stat-value">{score}</span>
          </div>
          
          <div className="score-stat">
            <span className="stat-label">PATRONS SERVED:</span>
            <span className="stat-value">{patronsServed}</span>
          </div>
          
          <div className="score-stat">
            <span className="stat-label">AVERAGE SCORE:</span>
            <span className="stat-value">{averageScore}/10</span>
          </div>
        </div>
        
        <button 
          className="restart-button"
          onClick={onRestart}
          onMouseEnter={() => {
            const hoverAudio = new Audio('assets/sounds/effects/hover.mp3')
            hoverAudio.volume = 0.3
            hoverAudio.play().catch(console.error)
          }}
        >
          START NEW SHIFT
        </button>
      </div>
    </div>
  )
}
