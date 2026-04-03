import { isLocalId, type ConstructorStage } from '@/entities/course';

export function buildTreePayloadFromLocalSelection(
  stages: ConstructorStage[],
  stageId: string,
  lessonId: string,
  taskId: string | null,
): {
  stepServerId: number | null;
  lessonServerId: number | null;
  taskId: string | null;
} {
  const stage = stages.find((s) => s.id === stageId);
  const lesson = stage?.lessons.find((l) => l.id === lessonId);
  if (stage?.serverId == null || lesson?.serverId == null) {
    return { stepServerId: null, lessonServerId: null, taskId: null };
  }

  let tid: string | null = null;
  if (taskId != null) {
    const task = lesson.tasks.find((t) => t.id === taskId);
    if (task && !isLocalId(task.id)) {
      tid = task.id;
    }
  }

  return {
    stepServerId: stage.serverId,
    lessonServerId: lesson.serverId,
    taskId: tid,
  };
}
