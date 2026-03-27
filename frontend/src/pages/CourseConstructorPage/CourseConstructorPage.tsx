import {
  createInitialStages,
  generateLocalId,
  getStageOrdinalLabel,
  useGetCoursesQuery,
  type ConstructorStage,
} from '@/entities/course';
import { getInfoDisplayTitle } from '@/shared/config/info';
import { CourseConstructorLeftBar } from '@/widgets/info';
import { useParams } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import styles from './CourseConstructorPage.module.scss';

export const CourseConstructorPage = () => {
  const { courseSlug } = useParams({ strict: false });

  const { data: courses } = useGetCoursesQuery(undefined, {
    skip: !courseSlug,
  });
  const course = courses?.find((c) => c.slug === courseSlug) ?? null;
  const courseTitle = getInfoDisplayTitle(course?.title ?? 'Курс', 'course');

  const [stages, setStages] = useState<ConstructorStage[]>(createInitialStages);
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const handleSelectStage = useCallback((stageId: string) => {
    setActiveStageId(stageId);
    setActiveLessonId(null);
    setActiveTaskId(null);
  }, []);

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
    setStages((prev) => [
      ...prev,
      {
        id: generateLocalId(),
        label: getStageOrdinalLabel(prev.length),
        title: `Ступень ${prev.length + 1}`,
        lessons: [],
      },
    ]);
  }, []);

  const handleAddLesson = useCallback((stageId: string) => {
    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id !== stageId) return stage;
        return {
          ...stage,
          lessons: [
            ...stage.lessons,
            {
              id: generateLocalId(),
              title: `Урок ${stage.lessons.length + 1}`,
              tasks: [],
            },
          ],
        };
      }),
    );
  }, []);

  const handleDeleteStage = useCallback((stageId: string) => {
    setStages((prev) => prev.filter((s) => s.id !== stageId));
    setActiveStageId((prev) => {
      if (prev === stageId) {
        setActiveLessonId(null);
        setActiveTaskId(null);
        return null;
      }
      return prev;
    });
  }, []);

  const handleDeleteLesson = useCallback(
    (stageId: string, lessonId: string) => {
      setStages((prev) =>
        prev.map((stage) => {
          if (stage.id !== stageId) return stage;
          return {
            ...stage,
            lessons: stage.lessons.filter((l) => l.id !== lessonId),
          };
        }),
      );
      setActiveLessonId((prev) => {
        if (prev === lessonId) {
          setActiveTaskId(null);
          return null;
        }
        return prev;
      });
    },
    [],
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
      setStages((prev) =>
        prev.map((stage) =>
          stage.id === stageId ? { ...stage, title: newTitle } : stage,
        ),
      );
    },
    [],
  );

  const handleRenameLesson = useCallback(
    (stageId: string, lessonId: string, newTitle: string) => {
      setStages((prev) =>
        prev.map((stage) => {
          if (stage.id !== stageId) return stage;
          return {
            ...stage,
            lessons: stage.lessons.map((lesson) =>
              lesson.id === lessonId
                ? { ...lesson, title: newTitle }
                : lesson,
            ),
          };
        }),
      );
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

  const activeStage = stages.find((s) => s.id === activeStageId);
  const activeLesson = activeStage?.lessons.find(
    (l) => l.id === activeLessonId,
  );
  const activeTask = activeLesson?.tasks.find((t) => t.id === activeTaskId);

  return (
    <div className={styles.root}>
      <CourseConstructorLeftBar
        backUrl="/cabinet/courses"
        title={courseTitle}
        stages={stages}
        activeStageId={activeStageId}
        activeLessonId={activeLessonId}
        activeTaskId={activeTaskId}
        onSelectStage={handleSelectStage}
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
        ) : activeStage ? (
          <>
            <h2>{activeStage.title}</h2>
            <p className={styles.placeholder}>
              Настройка ступени будет доступна после подключения бекенда
            </p>
          </>
        ) : (
          <p className={styles.placeholder}>
            Выберите ступень, урок или задание для редактирования
          </p>
        )}
      </div>
    </div>
  );
};
