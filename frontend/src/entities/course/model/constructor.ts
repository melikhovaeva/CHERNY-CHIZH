import type {
  CourseStepRead,
  CourseTaskQuestionRead,
} from "@/shared/api/generated/courses.generated";

export interface ConstructorTask {
  id: string;
  serverId?: number;
  title: string;
  isPublished?: boolean;
  /** Вопросы задания, загруженные с сервера или сохранённые локально после save. */
  questions?: CourseTaskQuestionRead[];
}

export interface ConstructorLesson {
  id: string;
  serverId?: number;
  title: string;
  articleSlug?: string | null;
  tasks: ConstructorTask[];
  isCreating?: boolean;
}

export interface ConstructorStage {
  id: string;
  serverId?: number;
  label: string;
  title: string;
  lessons: ConstructorLesson[];
}

const STAGE_ORDINAL_LABELS = [
  "Первая ступень",
  "Вторая ступень",
  "Третья ступень",
  "Четвёртая ступень",
  "Пятая ступень",
  "Шестая ступень",
  "Седьмая ступень",
  "Восьмая ступень",
  "Девятая ступень",
  "Десятая ступень",
];

export function getStageOrdinalLabel(index: number): string {
  return STAGE_ORDINAL_LABELS[index] ?? `Ступень ${index + 1}`;
}

let nextLocalId = 1;
export function generateLocalId(): string {
  return `local-${Date.now()}-${nextLocalId++}`;
}

export function isLocalId(id: string): boolean {
  return id.startsWith("local-");
}

export function createInitialStages(): ConstructorStage[] {
  return [
    {
      id: generateLocalId(),
      label: getStageOrdinalLabel(0),
      title: "Ступень 1",
      lessons: [],
    },
  ];
}

/**
 * Для ученика: не показываем ступени без доступных уроков.
 * В публичном API у таких шагов `lessons` уже пустой (неопубликованные отфильтрованы на бэкенде).
 */
export function filterCourseStepsForLearnerTree(
  serverSteps: CourseStepRead[],
): CourseStepRead[] {
  return serverSteps.filter((step) => step.lessons.length > 0);
}

/** Ступени из публичного CourseDetail (GET /courses/:id/) → дерево конструктора для предпросмотра. */
export function mapApiCourseStepsToConstructorStages(
  serverSteps: CourseStepRead[],
): ConstructorStage[] {
  return serverSteps.map((step, i) => {
    const localId = generateLocalId();
    return {
      id: localId,
      serverId: step.id,
      label: getStageOrdinalLabel(i),
      title: step.title,
      lessons: step.lessons.map((lesson) => {
        const lessonLocalId = generateLocalId();
        return {
          id: lessonLocalId,
          serverId: lesson.id,
          title: lesson.title,
          articleSlug: lesson.article?.slug ?? null,
          tasks: lesson.tasks.map((task) => ({
            id: String(task.id),
            serverId: task.id,
            title: task.title,
            isPublished: task.isPublished,
            questions: task.questions,
          })),
        };
      }),
    };
  });
}
