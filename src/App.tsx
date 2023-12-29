import { PropsWithChildren, useMemo, useState } from 'react'

import toast from 'react-hot-toast'
import { IlluminatedLetterAssetId, useIlluminatedLetterImageAsset } from './assets.illuminatedLetters'
import bibleVulgate from './bible.vulgate'
import { abs, keys, pickRandom, shuffleWithIndex } from './utils'

function Word({ className, onClick, children }: PropsWithChildren<{ className?: string; onClick?: () => void }>) {
  const cls = `inline-block mx-1 my-1 p-0.5 font-serif text-2xl align-bottom rounded leading-none ${className}`

  return onClick ? (
    <button className={cls} onClick={onClick}>
      {children}
    </button>
  ) : (
    <div className={cls}>{children}</div>
  )
}

function WordIlluminated({ className, children: word }: { className: string; children: string }) {
  const letterToIlluminate = word.replace(/\(/g, '')[0].toUpperCase() as IlluminatedLetterAssetId
  const illuminatedLetterImage = useIlluminatedLetterImageAsset(letterToIlluminate)

  return illuminatedLetterImage ? (
    <>
      <Word className={`float-left ${className}`}>
        <canvas
          className="inline-block h-[138px]"
          ref={canvas => {
            if (illuminatedLetterImage) {
              if (canvas) {
                canvas.width = illuminatedLetterImage.naturalWidth
                canvas.height = illuminatedLetterImage.naturalHeight
                const ctx = canvas.getContext('2d')
                if (ctx) {
                  ctx.drawImage(illuminatedLetterImage, 0, 0)
                }
              }
            }
          }}
        />
      </Word>
      <Word className={className}>{!word.startsWith('(') ? word.slice(1) : word.slice(2)}</Word>
    </>
  ) : (
    <Word className={className}>{word}</Word>
  )
}

function App() {
  // const seed = useMemo(() => String(random()), [])
  const seed = '0.12345678'

  const randomBook = useMemo(() => pickRandom(keys(bibleVulgate), { seed }) as keyof typeof bibleVulgate, [seed])
  const randomChapter = useMemo(
    () =>
      pickRandom(keys(bibleVulgate[randomBook]), {
        seed,
      }) as keyof (typeof bibleVulgate)[typeof randomBook],
    [randomBook, seed],
  )
  const randomVerse = useMemo(
    () =>
      pickRandom(keys(bibleVulgate[randomBook][randomChapter]), {
        seed,
      }) as keyof (typeof bibleVulgate)[typeof randomBook][typeof randomChapter],
    [randomBook, randomChapter, seed],
  )

  // const verse = bibleVulgate[randomBook][randomChapter][randomVerse]
  const verse = bibleVulgate['Gen']['1']['5'] // A
  // const verse = bibleVulgate['Gen']['8']['20'] // Æ
  // const verse = bibleVulgate['Gen']['1']['22'] // B
  // const verse = bibleVulgate['Gen']['1']['21'] // C
  // const verse = bibleVulgate['Gen']['1']['3'] // D
  // const verse = bibleVulgate['Jde']['1']['24'] // E - longest subverse
  // const verse = bibleVulgate['Gen']['1']['16'] // F
  // const verse = bibleVulgate['Gen']['4']['20'] // G
  // const verse = bibleVulgate['Gen']['5']['1'] // H
  // const verse = bibleVulgate['Gen']['1']['1'] // I
  // const verse = bibleVulgate['Gen']['21']['23'] // J
  // const verse = bibleVulgate['Gen']['8']['15'] // L
  // const verse = bibleVulgate['Gen']['3']['16'] // M
  // const verse = bibleVulgate['Gen']['2']['11'] // N
  // const verse = bibleVulgate['Gen']['7']['24'] // O
  // const verse = bibleVulgate['Sir']['1']['1'] // P - longest
  // const verse = bibleVulgate['Gen']['2']['24'] // Q
  // const verse = bibleVulgate['Gen']['4']['2'] // R
  // const verse = bibleVulgate['Num']['15']['11'] // S - shortest
  // const verse = bibleVulgate['Gen']['41']['46'] // (T
  // const verse = bibleVulgate['Gen']['1']['15'] // U
  // const verse = bibleVulgate['Gen']['1']['8'] // V
  // const verse = bibleVulgate['Sir']['20']['31'] // X
  // const verse = bibleVulgate['Num']['26']['13'] // Z

  const verseWords = verse.split(' ')

  const punctuationRegex = /[,.;:()!?]/g
  // 17 is the average word count per verse
  const distanceFromIndex17 = (i: number) => abs(i - 17)
  let punctuationIndexClosestTo17 = -1
  for (let i = 0; i < verseWords.length; i++) {
    if (
      verseWords[i].match(punctuationRegex) &&
      distanceFromIndex17(i) < distanceFromIndex17(punctuationIndexClosestTo17)
    ) {
      punctuationIndexClosestTo17 = i
    }
  }

  const subverseWords = verseWords.slice(0, punctuationIndexClosestTo17 + 1 || undefined)

  const subverseWordsShuffled = useMemo(
    () => shuffleWithIndex(subverseWords, { seed }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed],
  )

  const [subverseWordBuffer, setSubverseWordBuffer] = useState<[string, number][]>([[subverseWords[0], 0]])

  const allWordsUsed = subverseWordBuffer.length === subverseWords.length

  const onSubmit = () => {
    const match = subverseWordBuffer.map(([word]) => word).join(' ') === subverseWords.join(' ')
    if (match) {
      toast(<div className="text-6xl">RIGHT 🎉</div>)
    } else {
      toast(<div className="text-6xl">WRONG ❌</div>)
    }
  }

  return (
    <div className="absolute w-full h-full">
      <div className="fixed w-full h-full bg-yellow-50" />

      <div className="absolute flex justify-center w-full h-full">
        <div className="p-1 text-left w-96">
          {subverseWordBuffer.length > 0 && (
            <>
              <WordIlluminated className="text-gray-700 border border-yellow-400">
                {subverseWordBuffer[0][0]}
              </WordIlluminated>
              {subverseWordBuffer.slice(1).map(([word, i]) => (
                <Word key={i} className="text-gray-700 border border-yellow-400">
                  {word}
                </Word>
              ))}

              {subverseWordBuffer.length > 1 && (
                <Word
                  className="px-2 font-mono text-red-500 border border-red-500 shadow-inner"
                  onClick={() => {
                    if (subverseWordBuffer.length > 1) {
                      setSubverseWordBuffer(subverseWordBuffer.slice(0, -1))
                    }
                  }}
                >
                  ✗
                </Word>
              )}
            </>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 flex justify-center w-full bg-yellow-400">
        <div className="p-1 text-center max-w-96">
          {subverseWordsShuffled.map(([word, i]) => {
            const isUsed = subverseWordBuffer.some(([, j]) => j === i)

            return (
              <Word
                key={i}
                className={`px-2 py-3 text-xl text-gray-700 bg-yellow-50 rounded-md shadow-[0_1px_1px_0_rgba(0,0,0,0.4)] ${
                  isUsed && 'opacity-50'
                }`}
                onClick={
                  isUsed
                    ? undefined
                    : () => {
                        setSubverseWordBuffer([...subverseWordBuffer, [word, i]])
                      }
                }
              >
                {word}
              </Word>
            )
          })}

          {allWordsUsed ? (
            <Word
              className="px-2 py-3 font-mono text-xl text-yellow-50 bg-green-500 rounded-md shadow-[0_1px_1px_0_rgba(0,0,0,0.4)]"
              onClick={onSubmit}
            >
              ✓
            </Word>
          ) : (
            <Word
              className="px-2 py-3 font-mono text-xl text-yellow-50 bg-gray-700 rounded-md shadow-[0_1px_1px_0_rgba(0,0,0,0.4)]"
              onClick={() => {
                if (subverseWordBuffer.length > 1) {
                  setSubverseWordBuffer(subverseWordBuffer.slice(0, -1))
                }
              }}
            >
              {subverseWordBuffer.length}/{subverseWords.length}
            </Word>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
