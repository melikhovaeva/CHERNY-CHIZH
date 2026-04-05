import {
  generateLocalId,
  getStageOrdinalLabel,
  useCreateLessonMutation,
  useCreateStepMutation,
  useDeleteLessonMutation,
  useDeleteStepMutation,
  useGetCourseStepsQuery,
  useUpdateLessonPartialMutation,
  useUpdateStepPartialMutation,
  type ConstructorLesson,
  type ConstructorStage,
} from '@/entities/course';
import {
  buildTreePayloadFromLocalSelection,
  loadCourseWorkspaceState,
  mergeCourseWorkspaceState,
  resolveTreeSelection,
} from '@/features/course-workspace-persistence';
import { LessonArticleEditor } from '@/features/lesson-article-editor';
import { cn } from '@/shared/lib/utils';
import { useError } from '@/shared/ui/components/Toast';
import { CourseConstructorLeftBar } from '@/widgets/info/CourseConstructorLeftBar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CourseWorkspaceSkeleton } from '../CourseWorkspaceSkeleton';
import styles from './CourseConstructorTemplate.module.scss';

export interface CourseConstructorTemplateProps {
  courseId: number | null;
  persistenceCourseSlug?: string | null;
}

export const CourseConstructorTemplate = ({
  courseId,
  persistenceCourseSlug = null,
}: CourseConstructorTemplateProps) => {
  const showError = useError();

  const {
    data: serverSteps,
    isLoading,
    refetch: refetchCourseSteps,
  } = useGetCourseStepsQuery(
    { coursePk: String(courseId) },
    { skip: !courseId },
  );

  const [createStepApi] = useCreateStepMutation();
  const [updateStepApi] = useUpdateStepPartialMutation();
  const [deleteStepApi] = useDeleteStepMutation();
  const [createLessonApi] = useCreateLessonMutation();
  const [updateLessonApi] = useUpdateLessonPartialMutation();
  const [deleteLessonApi] = useDeleteLessonMutation();

  const [stages, setStages] = useState<ConstructorStage[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const localToServerIdMap = useRef<Record<string, number>>({});
  const stagesRef = useRef(stages);
  stagesRef.current = stages;

  // Prevents duplicate cascade creation when save is triggered multiple times
  // before the first creation completes. Maps localLessonId → Promise<articleSlug>.
  const pendingLessonCreations = useRef<
    Partial<Record<string, Promise<string>>>
  >({});

  const treeHydratedRef = useRef(false);

  useEffect(() => {
    treeHydratedRef.current = false;
  }, [courseId]);

  useEffect(() => {
    if (!persistenceCourseSlug || !initialized) return;
    if (stages.length === 0) return;
    if (treeHydratedRef.current) return;
    treeHydratedRef.current = true;

    const stored = loadCourseWorkspaceState(persistenceCourseSlug);
    const resolved = resolveTreeSelection(stages, {
      stepServerId: stored.stepServerId,
      lessonServerId: stored.lessonServerId,
      taskId: stored.taskId,
    });
    if (resolved) {
      setActiveStageId(resolved.stageId);
      setActiveLessonId(resolved.lessonId);
      setActiveTaskId(resolved.taskId);
    }
  }, [persistenceCourseSlug, initialized, stages]);

  const persistTreeSelection = useCallback(
    (stageId: string, lessonId: string, taskId: string | null) => {
      if (!persistenceCourseSlug) return;
      const payload = buildTreePayloadFromLocalSelection(
        stagesRef.current,
        stageId,
        lessonId,
        taskId,
      );
      mergeCourseWorkspaceState(persistenceCourseSlug, payload);
    },
    [persistenceCourseSlug],
  );

  // ── Initial load from server ───────────────────────────────────────────────

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
            articleSlug: lesson.article?.slug ?? null,
            tasks: lesson.tasks.map((task) => ({
              id: String(task.id),
              title: task.title,
            })),
          };
        }),
      };
    });

    setStages(loaded);
    setInitialized(true);
  }, [courseId, isLoading, serverSteps, initialized]);

  // ── Selection ──────────────────────────────────────────────────────────────

  const handleSelectLesson = useCallback(
    (stageId: string, lessonId: string) => {
      setActiveStageId(stageId);
      setActiveLessonId(lessonId);
      setActiveTaskId(null);
      persistTreeSelection(stageId, lessonId, null);
    },
    [persistTreeSelection],
  );

  const handleSelectTask = useCallback(
    (stageId: string, lessonId: string, taskId: string) => {
      setActiveStageId(stageId);
      setActiveLessonId(lessonId);
      setActiveTaskId(taskId);
      persistTreeSelection(stageId, lessonId, taskId);
    },
    [persistTreeSelection],
  );

  // ── Stage CRUD — add is local-only; delete/rename hit server if saved ──────

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
    setStages([...prev, newStage]);
  }, []);

  const handleDeleteStage = useCallback(
    async (stageId: string) => {
      const stage = stagesRef.current.find((s) => s.id === stageId);

      setStages((prev) =>
        prev
          .filter((s) => s.id !== stageId)
          .map((s, i) => ({ ...s, label: getStageOrdinalLabel(i) })),
      );
      setActiveStageId((prev) => {
        if (prev === stageId) {
          setActiveLessonId(null);
          setActiveTaskId(null);
          return null;
        }
        return prev;
      });

      const serverId = stage?.serverId ?? localToServerIdMap.current[stageId];
      if (!serverId) return; // never reached the server — nothing to delete

      try {
        await deleteStepApi({
          coursePk: String(courseId),
          id: String(serverId),
        }).unwrap();
      } catch {
        showError('Не удалось удалить ступень');
        void refetchCourseSteps();
      }
    },
    [courseId, deleteStepApi, refetchCourseSteps, showError],
  );

  const handleRenameStage = useCallback(
    async (stageId: string, newTitle: string) => {
      const stage = stagesRef.current.find((s) => s.id === stageId);

      setStages((prev) =>
        prev.map((s) => (s.id === stageId ? { ...s, title: newTitle } : s)),
      );

      const serverId = stage?.serverId ?? localToServerIdMap.current[stageId];
      if (!serverId) return; // not on server yet — title will be used at creation time

      try {
        await updateStepApi({
          coursePk: String(courseId),
          id: String(serverId),
          patchedCourseStepCreateUpdate: { title: newTitle },
        }).unwrap();
      } catch {
        showError('Не удалось переименовать ступень');
      }
    },
    [courseId, updateStepApi, showError],
  );

  // ── Lesson CRUD — add is local-only; cascade happens on first article save ─

  const handleAddLesson = useCallback((stageId: string) => {
    const stage = stagesRef.current.find((s) => s.id === stageId);
    if (!stage) return;

    const localId = generateLocalId();
    const order = stage.lessons.length;
    const newLesson: ConstructorLesson = {
      id: localId,
      title: `Урок ${order + 1}`,
      articleSlug: null,
      tasks: [],
    };

    setStages((prev) =>
      prev.map((s) =>
        s.id !== stageId ? s : { ...s, lessons: [...s.lessons, newLesson] },
      ),
    );

    // Auto-select so the editor panel opens immediately
    setActiveStageId(stageId);
    setActiveLessonId(localId);
    setActiveTaskId(null);
  }, []);

  const handleDeleteLesson = useCallback(
    async (stageId: string, lessonId: string) => {
      const stage = stagesRef.current.find((s) => s.id === stageId);
      const lesson = stage?.lessons.find((l) => l.id === lessonId);

      setStages((prev) =>
        prev.map((s) =>
          s.id !== stageId
            ? s
            : { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) },
        ),
      );
      setActiveLessonId((prev) => {
        if (prev === lessonId) {
          setActiveTaskId(null);
          return null;
        }
        return prev;
      });

      const serverId = lesson?.serverId ?? localToServerIdMap.current[lessonId];
      const stepServerId =
        stage?.serverId ?? localToServerIdMap.current[stageId];
      if (!serverId || !stepServerId) return; // never saved — nothing to delete

      try {
        await deleteLessonApi({
          coursePk: String(courseId),
          stepPk: String(stepServerId),
          id: String(serverId),
        }).unwrap();
      } catch {
        showError('Не удалось удалить урок');
        void refetchCourseSteps();
      }
    },
    [courseId, deleteLessonApi, refetchCourseSteps, showError],
  );

  const handleRenameLesson = useCallback(
    async (stageId: string, lessonId: string, newTitle: string) => {
      const stage = stagesRef.current.find((s) => s.id === stageId);
      const lesson = stage?.lessons.find((l) => l.id === lessonId);

      setStages((prev) =>
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

      const serverId = lesson?.serverId ?? localToServerIdMap.current[lessonId];
      const stepServerId =
        stage?.serverId ?? localToServerIdMap.current[stageId];
      if (!serverId || !stepServerId) return; // not on server yet

      try {
        await updateLessonApi({
          coursePk: String(courseId),
          stepPk: String(stepServerId),
          id: String(serverId),
          patchedCourseLessonCreateUpdate: { title: newTitle },
        }).unwrap();
      } catch {
        showError('Не удалось переименовать урок');
      }
    },
    [courseId, updateLessonApi, showError],
  );

  // ── Task handlers (local-only — no backend endpoint in the constructor) ────

  const handleAddTask = useCallback((stageId: string, lessonId: string) => {
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
  }, []);

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

  // ── Cascade creation: stage → lesson → article ────────────────────────────
  //
  // Called by useArticleEditor (via onBeforeSave) the first time the user saves
  // content in a lesson that hasn't been persisted to the server yet.
  // Returns the article slug so the editor can immediately issue a PATCH.

  const ensureLessonSaved = useCallback(
    async (stageId: string, lessonId: string): Promise<string> => {
      // Fast path: lesson already has an article slug
      const existingSlug = stagesRef.current
        .find((s) => s.id === stageId)
        ?.lessons.find((l) => l.id === lessonId)?.articleSlug;
      if (existingSlug) return existingSlug;

      // Deduplicate concurrent calls (e.g. user hammers save)
      if (pendingLessonCreations.current[lessonId]) {
        return pendingLessonCreations.current[lessonId]!;
      }

      if (!courseId) throw new Error('courseId is not set');

      const work = async (): Promise<string> => {
        // ── Step 1: ensure parent stage exists on server ──
        let stepServerId =
          stagesRef.current.find((s) => s.id === stageId)?.serverId ??
          localToServerIdMap.current[stageId];

        if (!stepServerId) {
          const currentStage = stagesRef.current.find((s) => s.id === stageId);
          if (!currentStage) throw new Error('Stage not found');

          const stageOrder = stagesRef.current.findIndex(
            (s) => s.id === stageId,
          );

          const stepResult = await createStepApi({
            coursePk: String(courseId),
            courseStepCreateUpdate: {
              title: currentStage.title,
              order: stageOrder,
            },
          }).unwrap();

          stepServerId = stepResult.id;
          localToServerIdMap.current[stageId] = stepServerId;

          setStages((prev) =>
            prev.map((s) =>
              s.id === stageId ? { ...s, serverId: stepResult.id } : s,
            ),
          );
        }

        // ── Step 2: create the lesson (backend auto-creates its Article) ──
        const currentLesson = stagesRef.current
          .find((s) => s.id === stageId)
          ?.lessons.find((l) => l.id === lessonId);
        if (!currentLesson) throw new Error('Lesson not found');

        const lessonOrder =
          stagesRef.current
            .find((s) => s.id === stageId)
            ?.lessons.findIndex((l) => l.id === lessonId) ?? 0;

        const lessonResult = await createLessonApi({
          coursePk: String(courseId),
          stepPk: String(stepServerId),
          courseLessonCreateUpdate: {
            title: currentLesson.title,
            order: lessonOrder,
          },
        }).unwrap();

        localToServerIdMap.current[lessonId] = lessonResult.id;

        // ── Step 3: refetch steps to get the generated articleSlug ──
        const refetchResult = await refetchCourseSteps();
        const serverStep = refetchResult.data?.find(
          (s) => s.id === stepServerId,
        );
        const serverLesson = serverStep?.lessons.find(
          (l) => l.id === lessonResult.id,
        );
        const articleSlug = serverLesson?.article?.slug;

        if (!articleSlug) {
          throw new Error('Не удалось получить slug статьи после создания');
        }

        // ── Step 4: update local state with server IDs and slug ──
        setStages((prev) =>
          prev.map((s) => {
            if (s.id !== stageId) return s;
            return {
              ...s,
              serverId: s.serverId ?? (stepServerId as number),
              lessons: s.lessons.map((l) =>
                l.id !== lessonId
                  ? l
                  : { ...l, serverId: lessonResult.id, articleSlug },
              ),
            };
          }),
        );

        return articleSlug;
      };

      const promise = work();
      pendingLessonCreations.current[lessonId] = promise;

      try {
        return await promise;
      } finally {
        delete pendingLessonCreations.current[lessonId];
      }
    },
    [courseId, createStepApi, createLessonApi, refetchCourseSteps],
  );

  // ── Derived ────────────────────────────────────────────────────────────────

  const activeLesson = stages
    .find((s) => s.id === activeStageId)
    ?.lessons.find((l) => l.id === activeLessonId);
  const activeTask = activeLesson?.tasks.find((t) => t.id === activeTaskId);

  /** Local IDs of lessons that have not yet been saved to the server. */
  const unsyncedIds = useMemo(
    () =>
      new Set(
        stages.flatMap((s) =>
          s.lessons.filter((l) => !l.serverId).map((l) => l.id),
        ),
      ),
    [stages],
  );

  if (!initialized && courseId) {
    return <CourseWorkspaceSkeleton />;
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className={styles.root}>
      <CourseConstructorLeftBar
        stages={stages}
        activeStageId={activeStageId}
        activeLessonId={activeLessonId}
        activeTaskId={activeTaskId}
        unsyncedIds={unsyncedIds}
        onSelectLesson={handleSelectLesson}
        onSelectTask={handleSelectTask}
        onAddStage={handleAddStage}
        onAddLesson={(stageId) => handleAddLesson(stageId)}
        onDeleteStage={(stageId) => void handleDeleteStage(stageId)}
        onDeleteLesson={(stageId, lessonId) =>
          void handleDeleteLesson(stageId, lessonId)
        }
        onAddTask={handleAddTask}
        onDeleteTask={handleDeleteTask}
        onRenameStage={(stageId, title) =>
          void handleRenameStage(stageId, title)
        }
        onRenameLesson={(stageId, lessonId, title) =>
          void handleRenameLesson(stageId, lessonId, title)
        }
        onRenameTask={handleRenameTask}
      />

      <div
        className={cn([
          styles.content,
          activeLesson?.articleSlug ? styles.content_flush : '',
        ])}
      >
        {activeTask ? (
          <>
            <h2>{activeTask.title}</h2>
            <p className={styles.placeholder}>
              Редактирование задания будет после добавления статьи
            </p>
          </>
        ) : activeLesson ? (
          // Editor is shown immediately for all selected lessons — even before
          // the lesson has been saved to the server. The first save/publish
          // triggers ensureLessonSaved which cascades: stage → lesson → article.
          <div
            className={cn([
              styles.articleEditor,
              !activeLesson.articleSlug ? styles.articleEditor_new : '',
            ])}
          >
            <LessonArticleEditor
              variant='embedded'
              articleSlug={activeLesson.articleSlug ?? undefined}
              onBeforeSave={
                activeStageId && activeLessonId
                  ? () => ensureLessonSaved(activeStageId, activeLessonId)
                  : undefined
              }
              lessonTitle={activeLesson.title}
              onLessonTitleChange={(t) => {
                if (activeStageId && activeLessonId) {
                  void handleRenameLesson(activeStageId, activeLessonId, t);
                }
              }}
              onDeleteLesson={() => {
                if (activeStageId && activeLessonId) {
                  void handleDeleteLesson(activeStageId, activeLessonId);
                }
              }}
            />
          </div>
        ) : (
          <p className={styles.placeholder}>
            Выберите урок или задание для редактирования
          </p>
        )}
      </div>
    </div>
  );
};
