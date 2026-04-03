export interface ConstructorTask {
  id: string;
  title: string;
}

export interface ConstructorLesson {
  id: string;
  serverId?: number;
  title: string;
  articleSlug?: string | null;
  tasks: ConstructorTask[];
}

export interface ConstructorStage {
  id: string;
  serverId?: number;
  label: string;
  title: string;
  lessons: ConstructorLesson[];
}

const STAGE_ORDINAL_LABELS = [
  'Первая ступень',
  'Вторая ступень',
  'Третья ступень',
  'Четвёртая ступень',
  'Пятая ступень',
  'Шестая ступень',
  'Седьмая ступень',
  'Восьмая ступень',
  'Девятая ступень',
  'Десятая ступень',
];

export function getStageOrdinalLabel(index: number): string {
  return STAGE_ORDINAL_LABELS[index] ?? `Ступень ${index + 1}`;
}

let nextLocalId = 1;
export function generateLocalId(): string {
  return `local-${Date.now()}-${nextLocalId++}`;
}

export function isLocalId(id: string): boolean {
  return id.startsWith('local-');
}

export function createInitialStages(): ConstructorStage[] {
  return [
    {
      id: generateLocalId(),
      label: getStageOrdinalLabel(0),
      title: 'Ступень 1',
      lessons: [],
    },
  ];
}
