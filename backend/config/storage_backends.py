"""
Minio/S3 storage с path-style URL: в адресе участвует имя бакета.
Иначе при custom_domain получается http://host/puppies/file.webp,
и Minio воспринимает "puppies" как бакет → AccessDenied (бакет cherniy-chizh).
"""
from urllib.parse import quote, urlencode

from django.conf import settings
from storages.backends.s3boto3 import S3Boto3Storage


class MinioPathStyleStorage(S3Boto3Storage):
    """
    Path-style URL для Minio: http://custom_domain/BUCKET_NAME/key
    """

    def url(self, name, parameters=None, expire=None):
        if expire is None and self.querystring_auth:
            expire = self.querystring_expire
        params = parameters.copy() if parameters else {}
        if expire and self.querystring_auth:
            params["AWSAccessKeyId"] = self.access_key
            params["Expires"] = expire
            params["Signature"] = self._get_signature(name, expire)
        if params:
            suffix = "?" + urlencode(params)
        else:
            suffix = ""
        protocol = getattr(settings, "AWS_S3_URL_PROTOCOL", "https:")
        domain = getattr(settings, "AWS_S3_CUSTOM_DOMAIN", "")
        bucket = getattr(settings, "AWS_STORAGE_BUCKET_NAME", "")
        if not domain or not bucket:
            return super().url(name, parameters=parameters, expire=expire)
        key = name.replace("\\", "/").lstrip("/")
        key_encoded = quote(key, safe="/")
        return f"{protocol}//{domain}/{bucket}/{key_encoded}{suffix}"
