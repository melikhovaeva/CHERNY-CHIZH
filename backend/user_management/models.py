from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

from .avatar import generate_default_avatar


class RolePermission(models.Model):
    """Атомарное разрешение, которое может быть назначено роли."""

    codename = models.CharField(max_length=64, unique=True, verbose_name="Код")
    description = models.CharField(max_length=255, verbose_name="Описание")

    class Meta:
        verbose_name = "Разрешение"
        verbose_name_plural = "Разрешения"
        ordering = ["codename"]

    def __str__(self):
        return self.description


class Role(models.Model):
    """Роль пользователя: пользователь, персонал, админ."""

    CODE_USER = "user"
    CODE_STAFF = "staff"
    CODE_ADMIN = "admin"

    code = models.CharField(max_length=32, unique=True, verbose_name="Код")
    label = models.CharField(max_length=255, verbose_name="Название")
    permissions = models.ManyToManyField(
        RolePermission,
        blank=True,
        related_name="roles",
        verbose_name="Разрешения",
    )

    class Meta:
        verbose_name = "Роль"
        verbose_name_plural = "Роли"
        ordering = ["id"]

    def __str__(self):
        return self.label

    def has_permission(self, codename: str) -> bool:
        return self.permissions.filter(codename=codename).exists()


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        
        first_name = extra_fields.pop('first_name', email.split('@')[0])
        last_name = extra_fields.pop('last_name', '')
        phone = extra_fields.pop('phone', None)
        messenger = extra_fields.pop('messenger', None)
        extra_fields.pop('first_name', None)
        extra_fields.pop('last_name', None)
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            first_name=first_name,
            last_name=last_name,
            phone=phone,
            messenger=messenger,
            **extra_fields,
        )

        user.set_password(password)
        generate_default_avatar(user)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
    
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        role = Role.objects.filter(code=Role.CODE_ADMIN).first()
        if role:
            user.role = role
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    objects = UserManager()

    role = models.ForeignKey(
        Role,
        on_delete=models.PROTECT,
        related_name="users",
        null=True,
        blank=True,
    )
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=12, blank=True, null=True)
    messenger = models.CharField(max_length=255, blank=True, null=True)
    avatar_image = models.ImageField(
        upload_to="avatars/",
        blank=True,
        null=True,
    )
    courses = models.ManyToManyField(
        "education.Course",
        through="education.CourseEnrollment",
        related_name="users",
        blank=True,
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name']

    def save(self, *args, **kwargs):
        if self.role_id is None and self.pk is None:
            default_role = Role.objects.filter(code=Role.CODE_USER).first()
            if default_role:
                self.role = default_role
        if self.role_id is not None:
            if self.role.code == Role.CODE_ADMIN:
                self.is_staff = True
                self.is_superuser = True
            elif self.role.code == Role.CODE_STAFF:
                self.is_staff = True
                self.is_superuser = False
            else:
                self.is_staff = False
                self.is_superuser = False
        generate_default_avatar(self)
        super().save(*args, **kwargs)