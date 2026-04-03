import {
  generateLocalId,
  getStageOrdinalLabel,
  useConstructorQueue,
  useGetCourseStepsQuery,
  type ConstructorLesson,
  type ConstructorStage,
} from '@/entities/course';
import { useError, useSuccess } from '@/shared/ui/components/Toast';
import { CourseConstructorLeftBar } from '@/widgets/info/CourseConstructorLeftBar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './CourseConstructorTemplate.module.scss';

export interface CourseConstructorTemplateProps {
  courseId: number | null;
}

export const CourseConstructorTemplate = ({
  courseId,
}: CourseConstructorTemplateProps) => {
  const showSuccess = useSuccess();
  const showError = useError();

  const { data: serverSteps, isLoading } = useGetCourseStepsQuery(
    { coursePk: String(courseId) },
    { skip: !courseId },
  );

  const [stages, setStages] = useState<ConstructorStage[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const localToServerIdMap = useRef<Record<string, number>>({});
  const stagesRef = useRef(stages);
  stagesRef.current = stages;

  const queue = useConstructorQueue();

  // Load server data on mount
  useEffect(() => {
    if (initialized) return;
    if (!courseId) {
      setStages([]);
      setInitialized(true);
      return;
    }
    if (isLoading || !serverSteps) return;

    const loaded: ConstructorStage[] = serverSteps.map((step, i) => {
      const localId = generateLocalId();
      localToServerIdMap.current[localId] = step.id;
      return {
        id: localId,
        serverId: step.id,
        label: getStageOrdinalLabel(i),
        title: step.title,
        lessons: step.lessons.map((lesson) => {
          const lessonLocalId = generateLocalId();
          localToServerIdMap.current[lessonLocalId] = lesson.id;
          return {
            id: lessonLocalId,
            serverId: lesson.id,
            title: lesson.title,
            tasks: lesson.tasks.map((task) => ({
              id: String(task.id),
              title: task.title,
            })),
          };
        }),
      };
    });

    setStages(loaded.length > 0 ? loaded : []);
    setInitialized(true);
  }, [courseId, isLoading, serverSteps, initialized]);

  // ── Unsycned IDs (items without serverId) ──

  const unsyncedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const stage of stages) {
      if (!stage.serverId) ids.add(stage.id);
      for (const lesson of stage.lessons) {
        if (!lesson.serverId) ids.add(lesson.id);
      }
    }
    // Also mark items that have pending queue updates
    for (const entry of queue.queue) {
      if (entry.action === 'update') {
        ids.add(entry.localId);
      }
    }
    return ids;
  }, [stages, queue.queue]);

  // ── Stage handlers ──

  const handleSelectLesson = useCallback(
    (stageId: string, lessonId: string) => {
      setActiveStageId(stageId);
      setActiveLessonId(lessonId);
      setActiveTaskId(null);
    },
    [],
  );

  const handleSelectTask = useCallback(
    (stageId: string, lessonId: string, taskId: string) => {
      setActiveStageId(stageId);
      setActiveLessonId(lessonId);
      setActiveTaskId(taskId);
    },
    [],
  );

  const handleAddStage = useCallback(() => {
    const prev = stagesRef.current;
    const localId = generateLocalId();
    const order = prev.length;
    const newStage: ConstructorStage = {
      id: localId,
      label: getStageOrdinalLabel(order),
      title: `Ступень ${order + 1}`,
      lessons: [],
    };
    queue.enqueueCreateStep(localId, newStage.title, order);
    setStages([...prev, newStage]);
  }, [queue]);

  const handleAddLesson = useCallback(
    (stageId: string) => {
      const prev = stagesRef.current;
      const stage = prev.find((s) => s.id === stageId);
      if (!stage) return;

      const localId = generateLocalId();
      const order = stage.lessons.length;
      const newLesson: ConstructorLesson = {
        id: localId,
        title: `Урок ${order + 1}`,
        tasks: [],
      };
      queue.enqueueCreateLesson(
        localId,
        stageId,
        stage.serverId,
        newLesson.title,
        order,
      );
      setStages(
        prev.map((s) =>
          s.id !== stageId
            ? s
            : { ...s, lessons: [...s.lessons, newLesson] },
        ),
      );
    },
    [queue],
  );

  const handleDeleteStage = useCallback(
    (stageId: string) => {
      const prev = stagesRef.current;
      const stage = prev.find((s) => s.id === stageId);
      if (stage) {
        const lessonLocalIds = stage.lessons.map((l) => l.id);
        queue.enqueueDeleteStep(stageId, stage.serverId, lessonLocalIds);
      }
      setStages(
        prev
          .filter((s) => s.id !== stageId)
          .map((s, i) => ({ ...s, label: getStageOrdinalLabel(i) })),
      );
      setActiveStageId((p) => {
        if (p === stageId) {
          setActiveLessonId(null);
          setActiveTaskId(null);
          return null;
        }
        return p;
      });
    },
    [queue],
  );

  const handleDeleteLesson = useCallback(
    (stageId: string, lessonId: string) => {
      const prev = stagesRef.current;
      const stage = prev.find((s) => s.id === stageId);
      const lesson = stage?.lessons.find((l) => l.id === lessonId);
      if (stage && lesson) {
        queue.enqueueDeleteLesson(
          lessonId,
          lesson.serverId,
          stageId,
          stage.serverId,
        );
      }
      setStages(
        prev.map((s) =>
          s.id !== stageId
            ? s
            : { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) },
        ),
      );
      setActiveLessonId((p) => {
        if (p === lessonId) {
          setActiveTaskId(null);
          return null;
        }
        return p;
      });
    },
    [queue],
  );

  const handleAddTask = useCallback(
    (stageId: string, lessonId: string) => {
      setStages((prev) =>
        prev.map((stage) => {
          if (stage.id !== stageId) return stage;
          return {
            ...stage,
            lessons: stage.lessons.map((lesson) => {
              if (lesson.id !== lessonId) return lesson;
              return {
                ...lesson,
                tasks: [
                  ...lesson.tasks,
                  {
                    id: generateLocalId(),
                    title: `Задание ${lesson.tasks.length + 1}`,
                  },
                ],
              };
            }),
          };
        }),
      );
    },
    [],
  );

  const handleDeleteTask = useCallback(
    (stageId: string, lessonId: string, taskId: string) => {
      setStages((prev) =>
        prev.map((stage) => {
          if (stage.id !== stageId) return stage;
          return {
            ...stage,
            lessons: stage.lessons.map((lesson) => {
              if (lesson.id !== lessonId) return lesson;
              return {
                ...lesson,
                tasks: lesson.tasks.filter((t) => t.id !== taskId),
              };
            }),
          };
        }),
      );
      setActiveTaskId((prev) => (prev === taskId ? null : prev));
    },
    [],
  );

  const handleRenameStage = useCallback(
    (stageId: string, newTitle: string) => {
      const prev = stagesRef.current;
      const stage = prev.find((s) => s.id === stageId);
      if (stage) {
        const order = prev.indexOf(stage);
        queue.enqueueUpdateStep(stageId, stage.serverId, newTitle, order);
      }
      setStages(
        prev.map((s) =>
          s.id === stageId ? { ...s, title: newTitle } : s,
        ),
      );
    },
    [queue],
  );

  const handleRenameLesson = useCallback(
    (stageId: string, lessonId: string, newTitle: string) => {
      const prev = stagesRef.current;
      const stage = prev.find((s) => s.id === stageId);
      const lesson = stage?.lessons.find((l) => l.id === lessonId);
      if (stage && lesson) {
        const order = stage.lessons.indexOf(lesson);
        queue.enqueueUpdateLesson(
          lessonId,
          lesson.serverId,
          stageId,
          stage.serverId,
          newTitle,
          order,
        );
      }
      setStages(
        prev.map((s) =>
          s.id !== stageId
            ? s
            : {
                ...s,
                lessons: s.lessons.map((l) =>
                  l.id === lessonId ? { ...l, title: newTitle } : l,
                ),
              },
        ),
      );
    },
    [queue],
  );

  const handleRenameTask = useCallback(
    (stageId: string, lessonId: string, taskId: string, newTitle: string) => {
      setStages((prev) =>
        prev.map((stage) => {
          if (stage.id !== stageId) return stage;
          return {
            ...stage,
            lessons: stage.lessons.map((lesson) => {
              if (lesson.id !== lessonId) return lesson;
              return {
                ...lesson,
                tasks: lesson.tasks.map((task) =>
                  task.id === taskId ? { ...task, title: newTitle } : task,
                ),
              };
            }),
          };
        }),
      );
    },
    [],
  );

  // ── Save handler ──

  const handleSave = useCallback(async () => {
    if (!courseId || !queue.hasChanges) return;
    setIsSaving(true);
    try {
      await queue.flush(courseId, localToServerIdMap);
      queue.clear();

      // Mark all items as synced by assigning serverIds from the map
      setStages((prev) =>
        prev.map((stage) => ({
          ...stage,
          serverId: stage.serverId ?? localToServerIdMap.current[stage.id],
          lessons: stage.lessons.map((lesson) => ({
            ...lesson,
            serverId:
              lesson.serverId ?? localToServerIdMap.current[lesson.id],
          })),
        })),
      );

      showSuccess('Изменения сохранены');
    } catch {
      showError('Не удалось сохранить изменения');
    } finally {
      setIsSaving(false);
    }
  }, [courseId, queue, showSuccess, showError]);

  const activeLesson = stages
    .find((s) => s.id === activeStageId)
    ?.lessons.find((l) => l.id === activeLessonId);
  const activeTask = activeLesson?.tasks.find((t) => t.id === activeTaskId);

  if (!initialized && courseId) {
    return null;
  }

  return (
    <div className={styles.root}>
      <CourseConstructorLeftBar
        stages={stages}
        activeStageId={activeStageId}
        activeLessonId={activeLessonId}
        activeTaskId={activeTaskId}
        unsyncedIds={unsyncedIds}
        hasChanges={queue.hasChanges}
        isSaving={isSaving}
        unsavedCount={queue.queue.length}
        onSave={courseId ? handleSave : undefined}
        onSelectLesson={handleSelectLesson}
        onSelectTask={handleSelectTask}
        onAddStage={handleAddStage}
        onAddLesson={handleAddLesson}
        onDeleteStage={handleDeleteStage}
        onDeleteLesson={handleDeleteLesson}
        onAddTask={handleAddTask}
        onDeleteTask={handleDeleteTask}
        onRenameStage={handleRenameStage}
        onRenameLesson={handleRenameLesson}
        onRenameTask={handleRenameTask}
      />

      <div className={styles.content}>
        {activeTask ? (
          <>
            <h2>{activeTask.title}</h2>
            <p className={styles.placeholder}>
              Редактирование задания будет доступно после подключения бекенда
            </p>
          </>
        ) : activeLesson ? (
          <>
            <h2>{activeLesson.title}</h2>
            <p className={styles.placeholder}>
              Редактирование урока будет доступно после подключения бекенда
            </p>
          </>
        ) : (
          <p className={styles.placeholder}>
            Выберите урок или задание для редактирования
          </p>
        )}

      </div>
    </div>
  );
};
