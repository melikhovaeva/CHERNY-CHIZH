import type { ConstructorStage } from '@/entities/course';

export type ResolvedTreeLocalIds = {
  stageId: string;
  lessonId: string;
  taskId: string | null;
};

export function resolveTreeSelection(
  stages: ConstructorStage[],
  persisted: {
    stepServerId: number | null;
    lessonServerId: number | null;
    taskId: string | null;
  },
): ResolvedTreeLocalIds | null {
  if (persisted.stepServerId == null || persisted.lessonServerId == null) {
    return null;
  }
  const stage = stages.find((s) => s.serverId === persisted.stepServerId);
  if (!stage) return null;
  const lesson = stage.lessons.find(
    (l) => l.serverId === persisted.lessonServerId,
  );
  if (!lesson) return null;

  let taskId: string | null = null;
  if (persisted.taskId != null) {
    const task = lesson.tasks.find((t) => t.id === persisted.taskId);
    if (task) taskId = task.id;
  }

  return { stageId: stage.id, lessonId: lesson.id, taskId };
}
