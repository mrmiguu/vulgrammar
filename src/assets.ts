// import { Howl } from 'howler'
import { useEffect, useState } from 'react'

// import { TextureLoader } from 'three'

const assets = import.meta.glob<{ default: unknown }>('./assets/**/*')

export const NoAssetFound = new Error('No asset found')

const getRawAsset_cache: { [path: string]: unknown } = {}
export const getRawAsset = async <T, R>(
  path: string,
  converter: ((asset: R) => Promise<T>) | undefined = undefined,
): Promise<T> => {
  if (!(path in getRawAsset_cache)) {
    const importer = assets[`./assets/${path}`]
    if (!importer) {
      throw NoAssetFound
    }

    const { default: asset } = await importer()
    const value = await (converter?.(asset as R) ?? Promise.resolve(asset))
    getRawAsset_cache[path] = value
  }

  return getRawAsset_cache[path] as Promise<T>
}

export const useRawAsset = <T, R>(
  path: string | undefined,
  converter: ((asset: R) => Promise<T>) | undefined = undefined,
) => {
  const [value, setValue] = useState<T>()

  useEffect(() => {
    if (path) getRawAsset(path, converter).then(setValue)
  }, [path, converter])

  return value
}

export const convertPathToImage = (asset: string): Promise<HTMLImageElement> => {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = asset
  })
}

// const textureLoader = new TextureLoader()

// export const convertPathToTexture = (asset: string) => textureLoader.loadAsync(asset)

// export type ConvertPathToAudioOptions = Partial<{
//   loop: boolean
//   volume: number
// }>

// export const convertPathToAudio =
//   (options: ConvertPathToAudioOptions) =>
//   (asset: string): Promise<Howl> => {
//     return new Promise(resolve => {
//       const howl = new Howl({ src: asset, ...options })
//       resolve(howl)
//     })
//   }

export const getImageAsset = (path: string) => getRawAsset(path, convertPathToImage)
// export const getTextureAsset = (path: string) => getRawAsset(path, convertPathToTexture)
// export const getAudioAsset = (path: string, options: ConvertPathToAudioOptions = { loop: false }) =>
//   getRawAsset(path, convertPathToAudio(options))

export const useImageAsset = (path: string | undefined) => useRawAsset(path, convertPathToImage)
// export const useTextureAsset = (path: string | undefined) => useRawAsset(path, convertPathToTexture)
// export const useAudioAsset = (path: string | undefined, options: ConvertPathToAudioOptions = { loop: false }) =>
//   useRawAsset(path, convertPathToAudio(options))
