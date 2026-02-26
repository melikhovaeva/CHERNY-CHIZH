import { UserProfilePage } from '@/pages/UserProfilePage/UserProfilePage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/user')({
  component: UserProfilePage,
});

