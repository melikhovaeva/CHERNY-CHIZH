import logging

from django.db.models.signals import post_delete, pre_save, post_save
from django.dispatch import receiver

from common.models import DogPhoto, Breed, DogDocument, Dog, DogStatus, Request

logger = logging.getLogger(__name__)


@receiver(pre_save, sender=Request)
def request_cache_old_status(sender, instance, **kwargs):
    """Кэшируем старый статус заявки перед сохранением."""
    if instance.pk:
        try:
            instance._old_status = Request.objects.filter(pk=instance.pk).values_list("status", flat=True).get()
        except Request.DoesNotExist:
            instance._old_status = None
    else:
        instance._old_status = None


@receiver(post_save, sender=Request)
def request_sync_dog_status(sender, instance, created, **kwargs):
    """
    Синхронизирует статус собаки при изменении статуса заявки типа 'Бронирование':
      - В работе  → Забронирована
      - Закрыта   → Продана (Куплена)
      - Отклонена → В продаже
    """
    if instance.request_type != Request.TYPE_BOOKING:
        return
    if not instance.dog_id:
        return

    old_status = getattr(instance, "_old_status", None)
    new_status = instance.status

    if old_status == new_status and not created:
        return

    status_map = {
        Request.STATUS_IN_WORK: DogStatus.BOOKED,
        Request.STATUS_CLOSED: DogStatus.SOLD,
        Request.STATUS_REJECTED: DogStatus.ON_SALE,
    }

    new_dog_status = status_map.get(new_status)
    if new_dog_status is not None:
        Dog.objects.filter(pk=instance.dog_id).update(status=new_dog_status)
        logger.info(
            "[Request #%s] dog #%s status → %s",
            instance.pk, instance.dog_id, new_dog_status,
        )


@receiver(post_delete, sender=DogPhoto)
def delete_dog_photo_from_storage(sender, instance, **kwargs):
    if instance.photo:
        try:
            instance.photo.delete(save=False)
        except Exception as e:
            logger.warning("[ERROR] Failed to delete photo from S3: %s", e)

@receiver(post_delete, sender=Breed)
def delete_breed_photo_from_storage(sender, instance, **kwargs):
    if instance.photo:
        try:
            instance.photo.delete(save=False)
        except Exception as e:
            logger.warning("[ERROR] Failed to delete photo from S3: %s", e)

@receiver(post_delete, sender=DogDocument)
def delete_dog_document_from_storage(sender, instance, **kwargs):
    if instance.file:
        try:
            instance.file.delete(save=False)
        except Exception as e:
            logger.warning("[ERROR] Failed to delete document from S3: %s", e)