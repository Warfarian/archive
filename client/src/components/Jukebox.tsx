import React, { useState, useEffect, useRef } from 'react'

interface JukeboxProps {
  isVisible: boolean
}

const JUKEBOX_SONGS = [
  'assets/sounds/music/jukebox/DavidKBD - Pink Bloom Pack - 01 - Pink Bloom.ogg',
  'assets/sounds/music/jukebox/DavidKBD - Pink Bloom Pack - 02 - Portal to Underworld.ogg',
  'assets/sounds/music/jukebox/DavidKBD - Pink Bloom Pack - 03 - To the Unknown.ogg',
  'assets/sounds/music/jukebox/DavidKBD - Pink Bloom Pack - 04 - Valley of Spirits.ogg',
  'assets/sounds/music/jukebox/DavidKBD - Pink Bloom Pack - 05 - Western Cyberhorse.ogg',
  'assets/sounds/music/jukebox/DavidKBD - Pink Bloom Pack - 06 - Diamonds on The Ceiling.ogg',
  'assets/sounds/music/jukebox/DavidKBD - Pink Bloom Pack - 07 - The Hidden One.ogg',
  'assets/sounds/music/jukebox/DavidKBD - Pink Bloom Pack - 09 - Lightyear City.ogg',
  'assets/sounds/music/jukebox/DavidKBD - Pink Bloom Pack - 08 - Lost Spaceships Signal.ogg'
]

export const Jukebox: React.FC<JukeboxProps> = ({ isVisible }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error)
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentSongIndex])

  const playHoverSound = () => {
    const hoverAudio = new Audio('assets/sounds/effects/hover.mp3')
    hoverAudio.volume = volume * 0.5
    hoverAudio.play().catch(console.error)
  }

  const playSelectSound = () => {
    const selectAudio = new Audio('assets/sounds/effects/select.mp3')
    selectAudio.volume = volume * 0.7
    selectAudio.play().catch(console.error)
  }

  const togglePlayPause = () => {
    playSelectSound()
    setIsPlaying(!isPlaying)
  }

  const nextSong = () => {
    playSelectSound()
    setCurrentSongIndex((prev) => (prev + 1) % JUKEBOX_SONGS.length)
  }

  const prevSong = () => {
    playSelectSound()
    setCurrentSongIndex((prev) => (prev - 1 + JUKEBOX_SONGS.length) % JUKEBOX_SONGS.length)
  }

  const getSongName = (path: string) => {
    const filename = path.split('/').pop()?.replace('.ogg', '').replace('.mp3', '') || 'Unknown'
    // Clean up the song name for display
    return filename
      .replace('DavidKBD - Pink Bloom Pack - ', '')
      .replace(/^\d+\s-\s/, '')
      .substring(0, 25) + (filename.length > 25 ? '...' : '')
  }

  if (!isVisible) return null

  return (
    <div className="jukebox">
      <div className="jukebox-header">♪ JUKEBOX ♪</div>
      
      <audio
        ref={audioRef}
        src={JUKEBOX_SONGS[currentSongIndex]}
        loop
        onEnded={() => nextSong()}
      />
      
      <div className="jukebox-controls">
        <button 
          className="jukebox-btn"
          onClick={prevSong}
          onMouseEnter={playHoverSound}
        >
          ◀
        </button>
        
        <button 
          className="jukebox-btn"
          onClick={togglePlayPause}
          onMouseEnter={playHoverSound}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        
        <button 
          className="jukebox-btn"
          onClick={nextSong}
          onMouseEnter={playHoverSound}
        >
          ▶
        </button>
      </div>
      
      <div className="volume-control">
        <span>VOL:</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="volume-slider"
          onMouseEnter={playHoverSound}
        />
      </div>
      
      <div className="now-playing">
        <div className="now-playing-text">
          {getSongName(JUKEBOX_SONGS[currentSongIndex])}
        </div>
      </div>
    </div>
  )
}