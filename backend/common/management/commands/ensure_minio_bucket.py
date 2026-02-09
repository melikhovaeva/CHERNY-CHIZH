import json
import os

import boto3
from botocore.exceptions import ClientError
from django.core.management.base import BaseCommand


def get_s3_client():
    return boto3.client(
        "s3",
        endpoint_url=os.getenv("AWS_S3_ENDPOINT_URL"),
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        region_name=os.getenv("AWS_S3_REGION_NAME", "us-east-1"),
        config=boto3.session.Config(s3={"addressing_style": "path"}),
    )


def public_read_policy(bucket_name):
    """Политика для анонимного чтения объектов (Minio требует Principal '*')."""
    return {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": [f"arn:aws:s3:::{bucket_name}/*"],
            }
        ],
    }


def cors_config():
    """CORS: доступ с фронтенда (localhost:3000) и из админки Django."""
    return {
        "CORSRules": [
            {
                "AllowedOrigins": [
                    "http://localhost:3000",
                    "http://127.0.0.1:3000",
                    "http://localhost:8000",
                    "http://127.0.0.1:8000",
                ],
                "AllowedMethods": ["GET", "HEAD"],
                "AllowedHeaders": ["*"],
            }
        ]
    }


class Command(BaseCommand):
    help = "Создаёт бакет в Minio, включает публичное чтение и CORS."

    def handle(self, *args, **options):
        bucket_name = os.getenv("AWS_STORAGE_BUCKET_NAME")
        endpoint_url = os.getenv("AWS_S3_ENDPOINT_URL")
        if not bucket_name or not endpoint_url:
            self.stderr.write(
                "AWS_STORAGE_BUCKET_NAME or AWS_S3_ENDPOINT_URL not set"
            )
            return
        s3 = get_s3_client()
        try:
            s3.head_bucket(Bucket=bucket_name)
            self.stdout.write(self.style.SUCCESS(f"Bucket {bucket_name} already exists."))
        except ClientError as e:
            error_code = e.response.get("Error", {}).get("Code", "")
            if error_code == "404":
                try:
                    s3.create_bucket(Bucket=bucket_name)
                    self.stdout.write(self.style.SUCCESS(f"Bucket {bucket_name} created."))
                except ClientError as create_err:
                    self.stderr.write(str(create_err))
                    return
            else:
                self.stderr.write(str(e))
                return

        try:
            s3.put_bucket_policy(
                Bucket=bucket_name,
                Policy=json.dumps(public_read_policy(bucket_name)),
            )
            self.stdout.write(self.style.SUCCESS("Bucket policy set (public read)."))
        except ClientError as e:
            self.stderr.write(f"Bucket policy: {e}")

        try:
            s3.put_bucket_cors(Bucket=bucket_name, CORSConfiguration=cors_config())
            self.stdout.write(self.style.SUCCESS("CORS configured for frontend."))
        except ClientError as e:
            self.stderr.write(f"CORS: {e}")
