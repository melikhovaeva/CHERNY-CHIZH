import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/cabinet/courses/$courseSlug/')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/cabinet/courses/$courseSlug/settings',
      params: { courseSlug: params.courseSlug },
    });
  },
});
