import {
  filterCourseStepsForLearnerTree,
  mapApiCourseStepsToConstructorStages,
  useGetCourseStepsQuery,
  type ConstructorStage,
} from '@/entities/course';
import type { CourseStepRead } from '@/shared/api/generated/courses.generated';
import {
  buildTreePayloadFromLocalSelection,
  loadCourseWorkspaceState,
  mergeCourseWorkspaceState,
  resolveTreeSelection,
} from '@/features/course-workspace-persistence';
import { LessonTaskViewer } from '@/features/lesson-task-viewer';
import { cn } from '@/shared/lib/utils';
import { CourseConstructorLeftBar } from '@/widgets/info/CourseConstructorLeftBar';
import { CourseWorkspaceSkeleton } from '../CourseWorkspaceSkeleton';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CourseConstructorLessonArticle } from '../CourseConstructorTemplate/CourseConstructorLessonArticle';
import { EmptyCourseProgramPlaceholder } from './EmptyCourseProgramPlaceholder';
import styles from './CoursePreviewTemplate.module.scss';

const EMPTY_SELECTION_HINT_ADMIN =
  'Выберите урок или задание в списке слева, чтобы открыть материал.';

const EMPTY_SELECTION_HINT_LEARNER =
  'Выберите урок слева, чтобы открыть материал.';

const EMPTY_PROGRAM_HINT_LEARNER =
  'Программа курса пока готовится. Загляните позже.';

const EMPTY_LESSON_ARTICLE_HINT_LEARNER =
  'Материал этого урока скоро появится.';

function previewNoop() {}

const previewNoopStage: (stageId: string) => void = () => {};

const previewNoopStageLesson: (stageId: string, lessonId: string) => void =
  () => {};

const previewNoopStageLessonTask: (
  stageId: string,
  lessonId: string,
  taskId: string,
) => void = () => {};

const previewNoopRenameTask: (
  stageId: string,
  lessonId: string,
  taskId: string,
  title: string,
) => void = () => {};

export interface CoursePreviewTemplateProps {
  courseId: number | null;
  persistenceCourseSlug?: string | null;
  /**
   * Ступени из публичного детального ответа курса (без education/steps, доступного только админам).
   * Если передано — запрос шагов не выполняется.
   */
  embeddedSteps?: CourseStepRead[];
  /** Режим прохождения: дружелюбные тексты и публичные статьи. */
  learnerMode?: boolean;
  /** Показывать ли кнопку сброса прогресса задания (только для администраторов). */
  isAdmin?: boolean;
}

export const CoursePreviewTemplate = ({
  courseId,
  persistenceCourseSlug = null,
  embeddedSteps,
  learnerMode = false,
  isAdmin = false,
}: CoursePreviewTemplateProps) => {
  const useEmbeddedSteps = embeddedSteps !== undefined;

  const { data: serverSteps, isLoading } = useGetCourseStepsQuery(
    { coursePk: String(courseId) },
    { skip: !courseId || useEmbeddedSteps },
  );

  const [stages, setStages] = useState<ConstructorStage[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const initialSelectionAppliedRef = useRef(false);

  useEffect(() => {
    setInitialized(false);
    setStages([]);
    setActiveStageId(null);
    setActiveLessonId(null);
    setActiveTaskId(null);
    initialSelectionAppliedRef.current = false;
  }, [courseId]);

  useEffect(() => {
    if (initialized) return;
    if (useEmbeddedSteps) {
      const raw = embeddedSteps ?? [];
      const stepsForTree = learnerMode
        ? filterCourseStepsForLearnerTree(raw)
        : raw;
      const loaded = mapApiCourseStepsToConstructorStages(stepsForTree);
      setStages(loaded.length > 0 ? loaded : []);
      setInitialized(true);
      return;
    }
    if (!courseId) {
      setStages([]);
      setInitialized(true);
      return;
    }
    if (isLoading || !serverSteps) return;

    const stepsForTree = learnerMode
      ? filterCourseStepsForLearnerTree(serverSteps)
      : serverSteps;
    const loaded = mapApiCourseStepsToConstructorStages(stepsForTree);

    setStages(loaded.length > 0 ? loaded : []);
    setInitialized(true);
  }, [
    courseId,
    isLoading,
    serverSteps,
    initialized,
    useEmbeddedSteps,
    embeddedSteps,
    learnerMode,
  ]);

  useEffect(() => {
    if (!initialized || stages.length === 0) return;
    if (initialSelectionAppliedRef.current) return;
    initialSelectionAppliedRef.current = true;

    if (persistenceCourseSlug) {
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
        return;
      }
    }

    const firstStage = stages[0];
    const firstLesson = firstStage?.lessons[0];
    if (firstLesson && firstStage) {
      setActiveStageId(firstStage.id);
      setActiveLessonId(firstLesson.id);
      setActiveTaskId(null);
    }
  }, [initialized, stages, persistenceCourseSlug]);

  const persistTreeSelection = useCallback(
    (stageId: string, lessonId: string, taskId: string | null) => {
      if (!persistenceCourseSlug) return;
      mergeCourseWorkspaceState(
        persistenceCourseSlug,
        buildTreePayloadFromLocalSelection(stages, stageId, lessonId, taskId),
      );
    },
    [persistenceCourseSlug, stages],
  );

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

  const activeLesson = stages
    .find((s) => s.id === activeStageId)
    ?.lessons.find((l) => l.id === activeLessonId);
  const activeTask = activeLesson?.tasks.find((t) => t.id === activeTaskId);

  const emptyUnsynced = useMemo(() => new Set<string>(), []);

  const showSkeleton =
    !initialized && (useEmbeddedSteps ? false : Boolean(courseId));

  if (showSkeleton) {
    return <CourseWorkspaceSkeleton />;
  }

  if (learnerMode && initialized && stages.length === 0) {
    return <EmptyCourseProgramPlaceholder />;
  }

  return (
    <div className={styles.root}>
      <CourseConstructorLeftBar
        readOnly
        emptyReadonlyHint={
          learnerMode ? EMPTY_PROGRAM_HINT_LEARNER : undefined
        }
        stages={stages}
        activeStageId={activeStageId}
        activeLessonId={activeLessonId}
        activeTaskId={activeTaskId}
        unsyncedIds={emptyUnsynced}
        onSelectLesson={handleSelectLesson}
        onSelectTask={handleSelectTask}
        onAddStage={previewNoop}
        onAddLesson={previewNoopStage}
        onDeleteStage={previewNoopStage}
        onDeleteLesson={previewNoopStageLesson}
        onAddTask={previewNoopStageLesson}
        onDeleteTask={previewNoopStageLessonTask}
        onRenameStage={previewNoopStage}
        onRenameLesson={previewNoopStageLesson}
        onRenameTask={previewNoopRenameTask}
      />

      <div
        className={cn([
          styles.content,
          activeLesson || activeTask ? styles.content_flush : '',
        ])}
      >
        {activeTask && activeTask.serverId && activeTask.questions ? (
          <LessonTaskViewer
            key={activeTask.id}
            taskTitle={activeTask.title}
            taskServerId={activeTask.serverId}
            questions={activeTask.questions}
            isAdmin={isAdmin}
          />
        ) : activeLesson ? (
          <div className={styles.articlePreview}>
            <CourseConstructorLessonArticle
              lessonTitle={activeLesson.title}
              articleSlug={activeLesson.articleSlug}
              emptyArticleHint={
                learnerMode ? EMPTY_LESSON_ARTICLE_HINT_LEARNER : undefined
              }
            />
          </div>
        ) : (
          <p className={styles.placeholder}>
            {learnerMode
              ? EMPTY_SELECTION_HINT_LEARNER
              : EMPTY_SELECTION_HINT_ADMIN}
          </p>
        )}
      </div>
    </div>
  );
};
