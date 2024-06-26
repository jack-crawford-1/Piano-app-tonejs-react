import Key from './Key'

const whiteKeys = [
  'C4',
  'D4',
  'E4',
  'F4',
  'G4',
  'A4',
  'B4',
  'C5',
  'D5',
  'E5',
  'F5',
  'G5',
  'A5',
  'B5',
]

const blackKeys = [
  { note: 'C#4', position: 1 },
  { note: 'D#4', position: 2 },
  { note: 'F#4', position: 4 },
  { note: 'G#4', position: 5 },
  { note: 'A#4', position: 6 },
  { note: 'C#5', position: 8 },
  { note: 'D#5', position: 9 },
  { note: 'F#5', position: 11 },
  { note: 'G#5', position: 12 },
  { note: 'A#5', position: 13 },
]

const Keyboard = ({ playChord }: { playChord: (notes: string[]) => void }) => {
  const keyElements = whiteKeys.map((note, index) => {
    const blackKey = blackKeys.find((bk) => bk.position === index + 1)

    return (
      <div key={note} className="key-wrapper">
        <Key note={note} playChord={playChord} type="white" />
        {blackKey && (
          <Key note={blackKey.note} playChord={playChord} type="black" />
        )}
      </div>
    )
  })

  return <div className="keys">{keyElements}</div>
}

export default Keyboard
