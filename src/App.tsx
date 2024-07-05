import { useEffect, useState } from 'react'
import './App.css'
import * as Tone from 'tone'
import chords from './Chords'
import Keyboard from './Keyboard'

function App() {
  const synth = new Tone.PolySynth(Tone.AMSynth, {
    harmonicity: 1.0,
    oscillator: {
      type: 'square',
    },
    envelope: {
      attack: 0.001,
      decay: 0.1,
      sustain: 0.3,
      release: 0.2,
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
      chord.forEach((note) => {
        document.querySelector(`[data-note="${note}"]`)?.classList.add('active')
      })
    }
  }

  const handleKeyUp = (event: { key: string }) => {
    const key = event.key.toUpperCase()

    setPressedKeys((prevKeys) => {
      const newKeys = new Set(prevKeys)
      newKeys.delete(key)
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
      setActiveChord(null)
      chord.forEach((note) => {
        document
          .querySelector(`[data-note="${note}"]`)
          ?.classList.remove('active')
      })
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [pressedKeys])

  return (
    <div className="piano">
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
          <span key={chord} className={activeChord === chord ? 'active' : ''}>
            {chord}
          </span>
        ))}
      </div>
    </div>
  )
}

export default App
