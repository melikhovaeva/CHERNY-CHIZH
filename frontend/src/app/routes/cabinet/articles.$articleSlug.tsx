import { ArticleWorkspacePage } from '@/pages/ArticleWorkspacePage';
import { ROLE_CODES } from '@/entities/session';
import { RoleGuard } from '@/features/session';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cabinet/articles/$articleSlug')({
  component: () => (
    <RoleGuard allowedRoles={[ROLE_CODES.ADMIN]}>
      <ArticleWorkspacePage />
    </RoleGuard>
  ),
});
