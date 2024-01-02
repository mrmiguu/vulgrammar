import Game from './Game'

function App() {
  // const seed = useMemo(() => String(random()), [])
  const seed = '0.12345678'
  const subverseLength = 2

  return (
    <div className="absolute w-full h-full">
      <Game subverseLength={subverseLength} seed={seed} tutorial />
    </div>
  )
}

export default App
