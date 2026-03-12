import { store } from '@/app/store';
import { CourseCreateEditPage } from '@/pages/CourseCreationPage/CourseCreateEditPage';
import { coursesApi } from '@/entities/course';
import { ProtectedRoute } from '@/features/session';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/courses/$courseId/edit')({
  loader: async ({ params: { courseId } }) => {
    const id = Number(courseId);

    if (Number.isNaN(id)) {
      return null;
    }

    const queryPromise = store.dispatch(
      coursesApi.endpoints.v1CoursesRetrieve.initiate({ id }),
    );

    try {
      await queryPromise;
    } finally {
      queryPromise.unsubscribe();
    }

    return null;
  },
  component: () => (
    <ProtectedRoute>
      <CourseCreateEditPage />
    </ProtectedRoute>
  ),
});

