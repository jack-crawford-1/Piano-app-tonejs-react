import { useEffect, useState, useRef } from 'react'
import './App.css'
import * as Tone from 'tone'
import chords from './Chords'
import Keyboard from './Keyboard'

function App() {
  const synth = new Tone.PolySynth(Tone.AMSynth, {
    harmonicity: 1.5,
    oscillator: {
      type: 'sine',
    },
    envelope: {
      attack: 0.0001,
      decay: 0.2,
      sustain: 0.5,
      release: 0.9,
    },
  }).toDestination()

  const playChord = (notes: string[]) => {
    const now = Tone.now()
    notes.forEach((note) => {
      synth.triggerAttackRelease(note, '4n', now)
    })
  }

  const [pressedKeys, setPressedKeys] = useState(new Set())
  const [activeChord, setActiveChord] = useState<string | null>(null)
  const activeKeysRef = useRef<string[]>([])

  const handleKeyDown = (event: { key: string }) => {
    const key = event.key.toUpperCase()

    setPressedKeys((prevKeys) => {
      const newKeys = new Set(prevKeys)
      newKeys.add(key)
      return newKeys
    })

    let chordKey = key
    if (pressedKeys.has('7')) {
      chordKey += '7'
    } else if (pressedKeys.has('M')) {
      chordKey += 'm'
    }

    const chord = chords[chordKey]
    if (chord) {
      playChord(chord)
      setActiveChord(chordKey)
      clearActiveKeys()
      setActiveKeys(chord)
    }
  }

  const handleKeyUp = () => {
    clearActiveKeys()
    setActiveChord(null)
  }

  const handleChordClick = (chordKey: string) => {
    const chord = chords[chordKey]
    if (chord) {
      playChord(chord)
      setActiveChord(chordKey)
      clearActiveKeys()
      setActiveKeys(chord)
    }
  }

  const clearActiveKeys = () => {
    activeKeysRef.current.forEach((note) => {
      document
        .querySelector(`[data-note="${note}"]`)
        ?.classList.remove('active')
    })
    activeKeysRef.current = []
  }

  const setActiveKeys = (keys: string[]) => {
    keys.forEach((note) => {
      document.querySelector(`[data-note="${note}"]`)?.classList.add('active')
    })
    activeKeysRef.current = keys
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    document.querySelectorAll('.chords span').forEach((span) => {
      span.addEventListener('mouseup', handleKeyUp)
    })
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      document.querySelectorAll('.chords span').forEach((span) => {
        span.removeEventListener('mouseup', handleKeyUp)
      })
    }
  }, [pressedKeys])

  return (
    <div className="piano">
      <div className="AAA">
        <h1>
          Mini keyboard using
          <img src="./ToneLogo.png" alt="tone.js" className="logo" />
          and React
          <img src="./ReactLogo.png" alt="react.js" className="react-logo" />
        </h1>
      </div>
      <Keyboard playChord={playChord} />
      <div className="chords">
        {[
          'C',
          'D',
          'E',
          'F',
          'G',
          'A',
          'B',
          'C7',
          'D7',
          'E7',
          'F7',
          'G7',
          'A7',
          'B7',
          'Cm',
          'Dm',
          'Em',
          'Fm',
          'Gm',
          'Am',
          'Bm',
        ].map((chord) => (
          <span
            key={chord}
            className={activeChord === chord ? 'active' : ''}
            onMouseDown={() => handleChordClick(chord)}
            onMouseUp={handleKeyUp}
          >
            {chord}
          </span>
        ))}
      </div>
      <div className="instructions">
        <p>
          Use keyboard to play chords (C, D, E, F, G, A, B). <br /> To play
          minor chords, press and hold 'm' before pressing the chord key. <br />{' '}
          For seventh chords, press and hold '7'. e.g holding "m" + "g" will
          play G minor
        </p>
        <p>Probably not the best experience on a mobile.</p>
      </div>
    </div>
  )
}

export default App
