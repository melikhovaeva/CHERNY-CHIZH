import logging

from django.db.models.signals import post_delete
from django.dispatch import receiver

from common.models import DogPhoto, Breed, DogDocument

logger = logging.getLogger(__name__)


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