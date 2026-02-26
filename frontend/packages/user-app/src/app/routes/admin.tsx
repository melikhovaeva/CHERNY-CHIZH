import { ADMIN_BASE_PATH } from '@/shared/config/api'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

function AdminRedirectPage() {
  useEffect(() => {
    if (window.location.pathname !== ADMIN_BASE_PATH) {
      window.location.replace(ADMIN_BASE_PATH)
    }
  }, [])

  return <div>Переходим в панель администратора…</div>
}

export const Route = createFileRoute('/admin')({
  component: AdminRedirectPage,
})

