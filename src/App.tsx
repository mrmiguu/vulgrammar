import { PropsWithChildren, useMemo } from 'react'

import { IlluminatedLetterAssetId, useIlluminatedLetterImageAsset } from './assets.illuminatedLetters'
import bibleVulgate from './bible.vulgate'
import { keys, pickRandom, shuffle } from './utils'

function Word({ className, children }: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`inline-block mx-1 my-1 p-0.5 font-serif text-2xl text-gray-700 align-bottom border rounded leading-none ${className}`}
    >
      {children}
    </div>
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
  // const verse = bibleVulgate['Gen']['1']['5'] // A
  // const verse = bibleVulgate['Gen']['8']['20'] // Æ
  // const verse = bibleVulgate['Gen']['1']['22'] // B
  // const verse = bibleVulgate['Gen']['1']['21'] // C
  // const verse = bibleVulgate['Gen']['1']['3'] // D
  const verse = bibleVulgate['Rev']['21']['19'] // E - average
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

  const verseWordsShuffled = shuffle([...verseWords], { seed })

  return (
    <div className="absolute w-full h-full">
      <div className="absolute w-full h-full bg-yellow-50" />

      <div className="absolute flex justify-center w-full h-full">
        <div className="p-1 text-justify max-w-96">
          <WordIlluminated className="border-yellow-400">{verseWords[0]}</WordIlluminated>
          {verseWords.slice(1).map((word, i) => (
            <Word key={i} className="border-yellow-400">
              {word}
            </Word>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 flex justify-center w-full bg-blue-50">
        <div className="p-1 text-center max-w-96">
          {verseWordsShuffled.map((word, i) => (
            <Word key={i} className="bg-white border-gray-700 shadow-inner">
              {word}
            </Word>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
