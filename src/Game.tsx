import { PropsWithChildren, useMemo, useState } from 'react'

import toast from 'react-hot-toast'
import { IlluminatedLetterAssetId, useIlluminatedLetterImageAsset } from './assets.illuminatedLetters'
import bibleVulgate from './bible.vulgate'
import { pickRandom, shuffleWithIndex } from './utils'

type BibleBook = keyof typeof bibleVulgate
type BibleChapter = keyof (typeof bibleVulgate)[BibleBook]
type BibleVerseNum = keyof (typeof bibleVulgate)[BibleBook][BibleChapter]
type BibleVerse = (typeof bibleVulgate)[BibleBook][BibleChapter][BibleVerseNum]
type BibleSubverseData = [
  book: BibleBook,
  chapter: BibleChapter,
  verseNum: BibleVerseNum,
  verse: BibleVerse,
  subverse: string,
]

const getSubversesOfLength_cache: Record<number, BibleSubverseData[]> = {}
const getSubversesOfLength = (n: number): BibleSubverseData[] => {
  if (n in getSubversesOfLength_cache) {
    return getSubversesOfLength_cache[n]
  }

  const punctuationRegex = /[,.;:()!?]/g
  const bibleSubverses: BibleSubverseData[] = []

  for (const bookStr in bibleVulgate) {
    const book = bookStr as BibleBook
    for (const chapterStr in bibleVulgate[book]) {
      const chapter = chapterStr as BibleChapter
      for (const verseStr in bibleVulgate[book][chapter]) {
        const verseNum = verseStr as BibleVerseNum
        const verse = bibleVulgate[book][chapter][verseNum]
        const verseWords = verse.split(' ')

        if (verseWords.length === n) {
          bibleSubverses.push([book, chapter, verseNum, verse, verse])
        } else if (verseWords[n - 1]?.match(punctuationRegex)) {
          bibleSubverses.push([book, chapter, verseNum, verse, verseWords.slice(0, n).join(' ')])
        }
      }
    }
  }

  getSubversesOfLength_cache[n] = bibleSubverses

  return bibleSubverses
}

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

type GameProps = {
  subverseLength: number
  seed: string
}

function Game({ subverseLength, seed }: GameProps) {
  const bibleSubverses = getSubversesOfLength(subverseLength)
  const [, , , , subverse] = useMemo(() => pickRandom(bibleSubverses, { seed }), [bibleSubverses, seed])

  // const verse = bibleVulgate['Gen']['1']['5'] // A
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

  const subverseWords = subverse.split(' ')
  const subverseWordsShuffled = useMemo(() => shuffleWithIndex(subverse.split(' '), { seed }), [subverse, seed])

  const emptyBuffer = (): [string, number][] => [[subverseWords[0], 0]]

  const [subverseWordBuffer, setSubverseWordBuffer] = useState(emptyBuffer())
  const getSubverseBuffer = () => subverseWordBuffer.map(([word]) => word).join(' ')
  const subverseBuffer = getSubverseBuffer()

  const [lastGuess, guess] = useState<string>()

  const allWordsUsed = subverseWordBuffer.length === subverseWords.length
  const guessUnchanged = lastGuess === subverseBuffer
  const matched = lastGuess === subverse

  const matchToast = (matched: boolean) => {
    if (matched) {
      toast(<div className="text-6xl">RIGHT 🎉</div>)
    } else {
      toast(<div className="text-6xl">WRONG ❌</div>)
    }
  }

  const onSubmit = () => {
    const subverseBuffer = getSubverseBuffer()
    matchToast(subverseBuffer === subverse)
    guess(subverseBuffer)
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

              {subverseWordBuffer.length > 1 && !matched && (
                <>
                  <Word
                    className="px-2 font-mono text-red-500 border border-red-500"
                    onClick={() => {
                      if (subverseWordBuffer.length > 1) {
                        setSubverseWordBuffer(subverseWordBuffer.slice(0, -1))
                      }
                    }}
                  >
                    ↩︎
                  </Word>

                  <Word
                    className="px-2 font-mono bg-red-500 border border-red-500 text-yellow-50"
                    onClick={() => setSubverseWordBuffer(emptyBuffer())}
                  >
                    ✗
                  </Word>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 flex justify-center w-full bg-yellow-400">
        <div className={`p-1 text-center max-w-96 ${matched && 'pointer-events-none'}`}>
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

          {allWordsUsed && !guessUnchanged ? (
            <Word
              className="px-2 py-3 font-mono text-xl text-yellow-50 bg-green-500 rounded-md shadow-[0_1px_1px_0_rgba(0,0,0,0.4)]"
              onClick={onSubmit}
            >
              ✓
            </Word>
          ) : (
            <Word className="px-2 py-3 font-mono text-xl text-yellow-50 bg-gray-700 rounded-md shadow-[0_1px_1px_0_rgba(0,0,0,0.4)]">
              {subverseWordBuffer.length}/{subverseWords.length}
            </Word>
          )}
        </div>
      </div>
    </div>
  )
}

export default Game
