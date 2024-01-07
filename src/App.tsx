import { useState } from 'react'
import Game, { BibleSubverseLength } from './Game'
import { Tutorial } from './Tutorial'
import { nowDay } from './utils'

function App() {
  // const seed = useMemo(() => String(random()), [])
  const seed = `${nowDay()}`
  const [subverseLength, setSubverseLength] = useState<BibleSubverseLength>(2)

  return (
    <div className="absolute w-full h-full">
      <Tutorial
        key={subverseLength} // TODO: a hacky way to force a re-render; fix this.
      >
        <Game
          key={subverseLength} // TODO: a hacky way to force a re-render; fix this.
          subverseLength={subverseLength}
          seed={seed}
          onComplete={won => {
            if (won) setSubverseLength((subverseLength + 1) as BibleSubverseLength)
          }}
          tutorial={subverseLength === 2}
        />
      </Tutorial>
    </div>
  )
}

export default App
