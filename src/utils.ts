import seedrandom from 'seedrandom'

export const { log, warn, error } = console
export const { stringify, parse } = JSON
export const { min, max, ceil, abs, pow, sqrt, sin, cos, tan, atan, atan2, PI } = Math
export const { keys, values, entries } = Object

type RandomOptions = {
  seed: string
}

const _random: { [seed: string]: seedrandom.PRNG } = {}
export const random = ({ seed }: Partial<RandomOptions> = {}) => {
  const key = seed ?? '*'
  _random[key] = _random[key] ?? seedrandom(seed)
  return _random[key]!()
}

// https://stackoverflow.com/a/12646864/4656851
export const shuffle = <T>(list: T[], { seed }: Partial<RandomOptions> = {}): T[] => {
  for (let i = list.length - 1; i > 0; i--) {
    const j = ~~(random({ seed }) * (i + 1))
    ;[list[i], list[j]] = [list[j]!, list[i]!]
  }
  return list
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const pickRandom = <T>(list: readonly T[], { seed }: Partial<RandomOptions> = {}): T =>
  list[~~(list.length * random({ seed }))]!

export const urlSearchParams = () =>
  Array.from(new URLSearchParams(location.search)).reduce<{ [k: string]: string }>(
    (m, [k, v]) => ({ ...m, [k]: v }),
    {},
  )

export const coordinatedUniversalMilliseconds = () => Date.now()
