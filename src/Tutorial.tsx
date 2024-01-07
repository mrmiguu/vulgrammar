import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react'
import interactiveToast from './toasts'

type TutorialContextProps = {
  tutorialNum: number
  tutorialStep: number
  setTutorialNum: (n: number) => void
  setTutorialStep: (n: number) => void
}

const TutorialContext = createContext<TutorialContextProps>(undefined as unknown as TutorialContextProps)

type TutorialStepProps = {
  num: number
  step: number
  text: string
}

export function TutorialStep({ num, step, text, children }: PropsWithChildren<TutorialStepProps>) {
  const { tutorialNum, tutorialStep, setTutorialStep } = useContext(TutorialContext)

  const isActive = num === tutorialNum && step === tutorialStep

  const onClick = async () => {
    setTutorialStep(0)
    await interactiveToast(text)
    setTutorialStep(tutorialStep + 1)
  }

  if (!isActive) {
    return children
  }

  return (
    <button className="inline-block animate-bounce" onClick={onClick}>
      <div className="pointer-events-none">{children}</div>
    </button>
  )
}

export function Tutorial({ children }: PropsWithChildren) {
  const [tutorialNum, setTutorialNum] = useState(1)
  const [tutorialStep, setTutorialStep] = useState(1)

  const value = useMemo(
    () => ({ tutorialNum, setTutorialNum, tutorialStep, setTutorialStep }),
    [tutorialNum, setTutorialNum, tutorialStep, setTutorialStep],
  )

  return <TutorialContext.Provider value={value}>{children}</TutorialContext.Provider>
}
