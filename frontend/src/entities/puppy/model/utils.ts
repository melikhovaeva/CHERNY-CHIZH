import type { Puppy, PuppyDocument, PuppySex } from './types'

export const getPuppyMainPhotoUrl = (puppy: Puppy): string =>
  puppy.photos[0]?.url ?? ''

export const formatPuppySex = (sex: PuppySex): string => {
  const sexMap: Record<string, string> = {
    dog: 'Мальчик',
    bitch: 'Девочка',
  }
  return sexMap[sex.name] ?? sex.name
}

export const formatPuppyDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

export const formatPuppyDocuments = (documents: PuppyDocument[]): string => {
  return documents.map((doc) => doc.name).join(', ')
}

