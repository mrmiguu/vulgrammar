import { useState } from 'react'
import Game, { BibleSubverseLength } from './Game'

function App() {
  // const seed = useMemo(() => String(random()), [])
  const seed = '0.12345678'
  const [subverseLength, setSubverseLength] = useState<BibleSubverseLength>(2)

  return (
    <div className="absolute w-full h-full">
      <Game
        key={subverseLength} // TODO: a hacky way to force a re-render; fix this.
        subverseLength={subverseLength}
        seed={seed}
        onComplete={won => {
          if (won) setSubverseLength((subverseLength + 1) as BibleSubverseLength)
        }}
        tutorial={subverseLength === 2}
      />
    </div>
  )
}

export default App
