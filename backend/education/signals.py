import logging

from django.db.models.signals import post_delete
from django.dispatch import receiver

from education.models import CourseLesson

logger = logging.getLogger(__name__)


@receiver(post_delete, sender=CourseLesson)
def delete_lesson_article_on_lesson_delete(sender, instance, **kwargs):
    """При удалении урока удаляем связанную с ним статью (если она создана для урока)."""
    if instance.article_id and getattr(instance, "article", None):
        try:
            article = instance.article
            if article.is_lesson_article:
                article.delete()
                logger.info("[CourseLesson #%s] lesson article #%s deleted", instance.pk, article.pk)
        except Exception as e:
            logger.warning("[CourseLesson #%s] failed to delete lesson article: %s", instance.pk, e)
