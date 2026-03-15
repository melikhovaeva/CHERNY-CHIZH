import { store } from '@/app/store';
import { CourseCreateEditPage } from '@/pages/CourseCreationPage/CourseCreateEditPage';
import { ROLE_CODES } from '@/entities/session';
import { coursesApi } from '@/entities/course';
import { RoleGuard } from '@/features/session';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cabinet/courses/$courseId/edit')({
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
    <RoleGuard allowedRoles={[ROLE_CODES.ADMIN]}>
      <CourseCreateEditPage />
    </RoleGuard>
  ),
});

