const Key = ({
  note,
  playChord,
  type,
}: {
  note: string
  playChord: (notes: string[]) => void
  type: string
}) => (
  <div
    className={`${type}-key`}
    data-note={note}
    onClick={() => playChord([note])}
    style={type === 'black' ? { left: '30px', top: '0px' } : {}}
  >
    {note}
  </div>
)

export default Key
