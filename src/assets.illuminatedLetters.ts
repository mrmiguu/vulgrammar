import { getImageAsset, useImageAsset } from './assets'
import { keys } from './utils'

export const illuminatedLetterAssetIdToPath = {
  Æ: 'illuminated-letters/Æ.png',
  Z: 'illuminated-letters/Z.png',
  Y: 'illuminated-letters/Y.png',
  X: 'illuminated-letters/X.png',
  W: 'illuminated-letters/W.png',
  V: 'illuminated-letters/V.png',
  U: 'illuminated-letters/U.png',
  T: 'illuminated-letters/T.png',
  S: 'illuminated-letters/S.png',
  R: 'illuminated-letters/R.png',
  Q: 'illuminated-letters/Q.png',
  P: 'illuminated-letters/P.png',
  O: 'illuminated-letters/O.png',
  N: 'illuminated-letters/N.png',
  M: 'illuminated-letters/M.png',
  L: 'illuminated-letters/L.png',
  K: 'illuminated-letters/K.png',
  J: 'illuminated-letters/J.png',
  I: 'illuminated-letters/I.png',
  H: 'illuminated-letters/H.png',
  G: 'illuminated-letters/G.png',
  F: 'illuminated-letters/F.png',
  E: 'illuminated-letters/E.png',
  D: 'illuminated-letters/D.png',
  C: 'illuminated-letters/C.png',
  B: 'illuminated-letters/B.png',
  A: 'illuminated-letters/A.png',
} as const

export type IlluminatedLetterAssetId = keyof typeof illuminatedLetterAssetIdToPath

export const illuminatedLetterIds = keys(illuminatedLetterAssetIdToPath) as IlluminatedLetterAssetId[]

export const getIlluminatedLetterImageAsset = (illuminatedLetter: IlluminatedLetterAssetId) =>
  getImageAsset(illuminatedLetterAssetIdToPath[illuminatedLetter])
export const useIlluminatedLetterImageAsset = (illuminatedLetter: IlluminatedLetterAssetId) =>
  useImageAsset(illuminatedLetterAssetIdToPath[illuminatedLetter])
