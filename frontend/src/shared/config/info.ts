export const INFO_TYPE = {
  COURSE: 'course',
  ARTICLE: 'article',
} as const;

export type InfoType = (typeof INFO_TYPE)[keyof typeof INFO_TYPE];

export const INFO_TYPE_LABELS: Record<InfoType, string> = {
  [INFO_TYPE.COURSE]: 'Курс',
  [INFO_TYPE.ARTICLE]: 'Статья',
} as const;

export function getInfoDisplayTitle(title: string, infoType: InfoType): string {
  return title?.trim() ? title : INFO_TYPE_LABELS[infoType];
}
