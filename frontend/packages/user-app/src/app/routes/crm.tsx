import { CRM_BASE_PATH } from '@/shared/config/api';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

function CrmRedirectPage() {
  useEffect(() => {
    if (window.location.pathname !== CRM_BASE_PATH) {
      window.location.replace(CRM_BASE_PATH);
    }
  }, []);

  return <div>Переходим в панель CRM…</div>;
}

export const Route = createFileRoute('/crm')({
  component: CrmRedirectPage,
});
