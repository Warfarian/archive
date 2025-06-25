import React from 'react'

interface EndShiftButtonProps {
  onEndShift: () => void
  isVisible: boolean
}

export const EndShiftButton: React.FC<EndShiftButtonProps> = ({ 
  onEndShift, 
  isVisible 
}) => {
  if (!isVisible) return null

  return (
    <button 
      className="end-shift-button"
      onClick={onEndShift}
      onMouseEnter={() => {
        const hoverAudio = new Audio('assets/sounds/effects/hover.mp3')
        hoverAudio.volume = 0.3
        hoverAudio.play().catch(console.error)
      }}
    >
      END SHIFT
    </button>
  )
}
