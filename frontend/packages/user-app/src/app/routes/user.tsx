import { UserProfilePage } from '@/pages/UserProfilePage/UserProfilePage'
import { createFileRoute } from '@tanstack/react-router'
import { store } from '@/app/store'
import { sessionApi } from '@/entities/session/api/session.api'
import { coursesApi } from '@/entities/course/api/courses.api'

export const Route = createFileRoute('/user')({
  loader: async () => {
    const mePromise = store.dispatch(sessionApi.endpoints.me.initiate())
    const myCoursesPromise = store.dispatch(
      coursesApi.endpoints.getMyCourses.initiate(),
    )

    try {
      await Promise.all([mePromise, myCoursesPromise])
    } finally {
      mePromise.unsubscribe()
      myCoursesPromise.unsubscribe()
    }

    return null
  },
  component: UserProfilePage,
})


