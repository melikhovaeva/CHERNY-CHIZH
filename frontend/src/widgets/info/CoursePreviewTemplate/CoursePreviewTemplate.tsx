import {
  generateLocalId,
  getStageOrdinalLabel,
  useGetCourseStepsQuery,
  type ConstructorStage,
} from '@/entities/course';
import { CourseConstructorLeftBar } from '@/widgets/info/CourseConstructorLeftBar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CourseConstructorLessonArticle } from '../CourseConstructorTemplate/CourseConstructorLessonArticle';
import styles from './CoursePreviewTemplate.module.scss';

const EMPTY_SELECTION_HINT =
  'Выберите урок или задание в списке слева, чтобы открыть материал.';

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
}

export const CoursePreviewTemplate = ({
  courseId,
}: CoursePreviewTemplateProps) => {
  const { data: serverSteps, isLoading } = useGetCourseStepsQuery(
    { coursePk: String(courseId) },
    { skip: !courseId },
  );

  const [stages, setStages] = useState<ConstructorStage[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  useEffect(() => {
    setInitialized(false);
    setStages([]);
    setActiveStageId(null);
    setActiveLessonId(null);
    setActiveTaskId(null);
  }, [courseId]);

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
              title: task.title,
            })),
          };
        }),
      };
    });

    setStages(loaded.length > 0 ? loaded : []);
    setInitialized(true);
  }, [courseId, isLoading, serverSteps, initialized]);

  useEffect(() => {
    if (!initialized || stages.length === 0) return;
    if (activeStageId != null && activeLessonId != null) return;

    const firstStage = stages[0];
    const firstLesson = firstStage?.lessons[0];
    if (firstLesson && firstStage) {
      setActiveStageId(firstStage.id);
      setActiveLessonId(firstLesson.id);
      setActiveTaskId(null);
    }
  }, [initialized, stages, activeStageId, activeLessonId]);

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

  const activeLesson = stages
    .find((s) => s.id === activeStageId)
    ?.lessons.find((l) => l.id === activeLessonId);
  const activeTask = activeLesson?.tasks.find((t) => t.id === activeTaskId);

  const emptyUnsynced = useMemo(() => new Set<string>(), []);

  if (!initialized && courseId) {
    return null;
  }

  return (
    <div className={styles.root}>
      <CourseConstructorLeftBar
        readOnly
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

      <div className={styles.content}>
        {activeLesson ? (
          <CourseConstructorLessonArticle
            lessonTitle={activeLesson.title}
            articleSlug={activeLesson.articleSlug}
            previewTaskTitle={activeTask?.title}
          />
        ) : (
          <p className={styles.placeholder}>{EMPTY_SELECTION_HINT}</p>
        )}
      </div>
    </div>
  );
};
