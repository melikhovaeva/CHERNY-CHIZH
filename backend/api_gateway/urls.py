
from django.urls import include, path
from rest_framework import permissions
from rest_framework.routers import DefaultRouter

from common.views import (
    AdminDogViewSet,
    BreedViewSet,
    DictionaryViewSet,
    DogByBreedSlugViewSet,
    DogViewSet,
    RequestViewSet,
)
from consumer.views import FAQItemViewSet
from education.views import (
    ArticleViewSet,
    CourseViewSet,
    EducationArticleViewSet,
    EducationCourseViewSet,
    EducationCourseLessonTaskViewSet,
    EducationCourseLessonViewSet,
    EducationCourseStepViewSet,
    EducationTagViewSet,
    UserTaskAttemptViewSet,
)
from user_management.views import ProfileView

router = DefaultRouter()
router.register(r"dogs", DogViewSet, basename="dog")
router.register(r"breeds", BreedViewSet, basename="breed")
router.register(
    r"breeds/(?P<breed_slug>[-\w]+)/dogs",
    DogByBreedSlugViewSet,
    basename="dog-by-breed",
)
router.register(r"dictionaries", DictionaryViewSet, basename="dictionary")
router.register(r"nursery/dogs", AdminDogViewSet, basename="nursery-dog")
router.register(r"faq", FAQItemViewSet, basename="faq-item")
router.register(r"requests", RequestViewSet, basename="request")
router.register(r"articles", ArticleViewSet, basename="article")
router.register(r"courses", CourseViewSet, basename="course")
router.register(
    r"education/articles",
    EducationArticleViewSet,
    basename="education-article",
)
router.register(
    r"education/courses",
    EducationCourseViewSet,
    basename="education-course",
)
router.register(
    r"education/tags",
    EducationTagViewSet,
    basename="education-tag",
)
router.register(
    r"education/courses/(?P<course_pk>[^/.]+)/steps",
    EducationCourseStepViewSet,
    basename="education-course-step",
)
router.register(
    r"education/courses/(?P<course_pk>[^/.]+)/steps/(?P<step_pk>[^/.]+)/lessons",
    EducationCourseLessonViewSet,
    basename="education-course-lesson",
)
router.register(
    r"education/courses/(?P<course_pk>[^/.]+)/steps/(?P<step_pk>[^/.]+)/lessons/(?P<lesson_pk>[^/.]+)/tasks",
    EducationCourseLessonTaskViewSet,
    basename="education-course-lesson-task",
)
router.register(
    r"education/task-attempts",
    UserTaskAttemptViewSet,
    basename="education-task-attempt",
)

router.APIRootView.permission_classes = [permissions.AllowAny]

urlpatterns = [
    path("users/", include("user_management.urls")),
    path("", include("consumer.urls")),
    path("", include(router.urls)),
]
