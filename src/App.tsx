import { PropsWithChildren, useMemo } from 'react'

import { IlluminatedLetterAssetId, useIlluminatedLetterImageAsset } from './assets.illuminatedLetters'
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
  // const verse = bibleVulgate['Gen']['1']['5'] // A
  // const verse = bibleVulgate['Gen']['8']['20'] // Æ
  // const verse = bibleVulgate['Gen']['1']['22'] // B
  // const verse = bibleVulgate['Gen']['1']['21'] // C
  // const verse = bibleVulgate['Gen']['1']['3'] // D
  // const verse = bibleVulgate['Gen']['1']['4'] // E
  // const verse = bibleVulgate['Gen']['1']['16'] // F
  // const verse = bibleVulgate['Gen']['4']['20'] // G
  // const verse = bibleVulgate['Gen']['5']['1'] // H
  // const verse = bibleVulgate['Gen']['1']['1'] // I
  // const verse = bibleVulgate['Gen']['21']['23'] // J
  // const verse = bibleVulgate['Gen']['8']['15'] // L
  // const verse = bibleVulgate['Gen']['3']['16'] // M
  // const verse = bibleVulgate['Gen']['2']['11'] // N
  // const verse = bibleVulgate['Gen']['7']['24'] // O
  // const verse = bibleVulgate['Gen']['2']['8'] // P
  // const verse = bibleVulgate['Gen']['2']['24'] // Q
  // const verse = bibleVulgate['Gen']['4']['2'] // R
  // const verse = bibleVulgate['Gen']['2']['6'] // S
  // const verse = bibleVulgate['Gen']['41']['46'] // (T
  // const verse = bibleVulgate['Gen']['1']['15'] // U
  // const verse = bibleVulgate['Gen']['1']['8'] // V
  // const verse = bibleVulgate['Sir']['20']['31'] // X
  // const verse = bibleVulgate['Num']['26']['13'] // Z

  const letterToIlluminate = verse.replace(/\(/g, '')[0].toUpperCase() as IlluminatedLetterAssetId
  const verseWords = verse.split(' ')

  const illuminatedLetterImage = useIlluminatedLetterImageAsset(letterToIlluminate)

  const firstWordWithIlluminatedLetterEl = illuminatedLetterImage ? (
    <>
      <Word illuminated>
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
      </Word>
      <Word>{!verseWords[0].startsWith('(') ? verseWords[0].slice(1) : verseWords[0].slice(2)}</Word>
    </>
  ) : (
    <Word>{verseWords[0]}</Word>
  )

  return (
    <div className="absolute w-full h-full">
      <div className="absolute w-full h-full bg-yellow-50" />
      <div className="absolute w-full h-full p-1">
        {firstWordWithIlluminatedLetterEl}
        {verseWords.slice(1).map((word, i) => (
          <Word key={i}>{word}</Word>
        ))}
      </div>
    </div>
  )
}

export default App
