from rest_framework.permissions import BasePermission

from education.models import CourseEnrollment, CourseLesson
from user_management.permissions import CanManageCourses


class CanReadEducationArticle(BasePermission):
    """
    GET /education/articles/:slug/ — суперпользователь, роль с manage_courses,
    или пользователь с записью на курс, в программе которого есть этот урок.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        user = request.user
        if getattr(user, "is_superuser", False):
            return True
        if CanManageCourses().has_permission(request, view):
            return True
        try:
            lesson = obj.lesson
        except CourseLesson.DoesNotExist:
            return False
        course_id = lesson.step.course_id
        return CourseEnrollment.objects.filter(
            user=user,
            course_id=course_id,
        ).exists()
