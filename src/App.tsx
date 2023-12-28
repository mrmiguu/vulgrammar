import { PropsWithChildren, useMemo } from 'react'

import {
    IlluminatedLetterAssetId, useIlluminatedLetterImageAsset
} from './assets.illuminatedLetters'
import bibleVulgate from './bible.vulgate'
import { keys, pickRandom, random } from './utils'

function Word({ illuminated, children }: PropsWithChildren<{ illuminated?: boolean }>) {
  return (
    <div
      className={`inline-block mx-1 my-1 p-0.5 font-serif text-2xl text-gray-700 align-bottom border border-yellow-400 rounded leading ${
        illuminated && 'float-left'
      }`}
    >
      {children}
    </div>
  )
}

function App() {
  const seed = useMemo(() => String(random()), [])
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

  const verse = bibleVulgate[randomBook][randomChapter][randomVerse]
  // const verse = bibleVulgate['Gen']['1']['4']

  const letterToIlluminate = verse[0].toUpperCase() as IlluminatedLetterAssetId
  const verseWords = verse.split(' ')

  const illuminatedLetterImage = useIlluminatedLetterImageAsset(letterToIlluminate)

  const firstWordWithIlluminatedLetterEl = (
    <>
      <Word illuminated>
        {illuminatedLetterImage ? (
          <canvas
            className="inline-block h-[124px]"
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
        ) : (
          letterToIlluminate
        )}
      </Word>
      <Word>{verseWords[0].slice(1)}</Word>
    </>
  )

  return (
    <div className="absolute w-full h-full">
      <div className="absolute w-full h-full bg-yellow-50" />
      <div className="absolute w-full h-full p-1">
        <div className="">
          {firstWordWithIlluminatedLetterEl}
          {verseWords.slice(1).map((word, i) => (
            <Word key={i}>{word}</Word>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
