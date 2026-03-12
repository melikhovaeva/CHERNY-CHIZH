import { store } from '@/app/store';
import { sessionApi } from '@/entities/session/api/session.api';
import { UserCabinetPage } from '@/pages/UserCabinetPage/UserCabinetPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cabinet')({
  loader: async () => {
    const mePromise = store.dispatch(
      sessionApi.endpoints.v1UsersMeRetrieve.initiate(),
    );
    const myCoursesPromise = store.dispatch(
      sessionApi.endpoints.v1UsersMeCoursesList.initiate(),
    );

    try {
      await Promise.all([mePromise, myCoursesPromise]);
    } finally {
      mePromise.unsubscribe();
      myCoursesPromise.unsubscribe();
    }

    return null;
  },
  component: UserCabinetPage,
});
