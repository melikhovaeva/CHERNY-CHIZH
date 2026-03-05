from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from common.serializers import CamelCaseSerializerMixin
from user_management.models import Role, User


class RoleSerializer(serializers.ModelSerializer):
    """Только код и название роли; is_staff/is_superuser в API не отдаём."""

    class Meta:
        model = Role
        fields = ("code", "label")
        read_only_fields = ("code", "label")


class UserSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True, allow_null=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "phone",
            "messenger",
            "avatar_image",
            "role",
            "date_joined",
            "is_active",
        )
        read_only_fields = ("id", "date_joined", "is_active", "role")


class UserRoleUpdateSerializer(serializers.ModelSerializer):
    """Только смена роли; только для админа."""

    class Meta:
        model = User
        fields = ("role",)


class CurrentUserSerializer(CamelCaseSerializerMixin, serializers.ModelSerializer):
    """Данные текущего пользователя; ключи в camelCase для фронта."""

    role = RoleSerializer(read_only=True, allow_null=True)
    avatar_image = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "phone",
            "messenger",
            "avatar_image",
            "role",
        )
        read_only_fields = ("id", "role")

    def get_avatar_image(self, obj):
        if obj.avatar_image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.avatar_image.url)
            return obj.avatar_image.url
        return None

    def validate_email(self, value: str) -> str:
        email = User.objects.normalize_email(value)
        qs = User.objects.filter(email=email)
        if self.instance is not None:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Пользователь с таким email уже зарегистрирован")
        return email

    def validate(self, attrs):
        for field in ("phone", "messenger", "last_name"):
            if attrs.get(field) == "":
                attrs[field] = None
        return attrs

class RegisterSerializer(serializers.ModelSerializer):
  password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
  password2 = serializers.CharField(write_only=True, required=True)
  last_name = serializers.CharField(required=False, allow_blank=True, max_length=255)
  
  class Meta:
    model = User
    fields = ('email', 'password', 'password2', 'first_name', 'last_name')

  def validate(self, attrs):
    if attrs['password'] != attrs['password2']:
      raise serializers.ValidationError({"password": "Пароли не совпадают"})
    return attrs

  def create(self, validated_data):
    validated_data.pop('password2')
    user = User.objects.create_user(**validated_data)
    return user


class RegisterStep1Serializer(serializers.Serializer):
  email = serializers.EmailField(required=True)
  password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
  password2 = serializers.CharField(write_only=True, required=True)

  def validate(self, attrs):
    if attrs['password'] != attrs['password2']:
      raise serializers.ValidationError({"password2": "Пароли не совпадают"})
    email = User.objects.normalize_email(attrs['email'])
    if User.objects.filter(email=email).exists():
      raise serializers.ValidationError({"email": "Пользователь с таким email уже зарегистрирован"})
    attrs['email'] = email
    return attrs


class RegisterStep2Serializer(serializers.Serializer):
  email = serializers.EmailField(required=True)
  password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
  password2 = serializers.CharField(write_only=True, required=True)
  first_name = serializers.CharField(required=True, max_length=255)
  last_name = serializers.CharField(required=False, allow_blank=True, max_length=255)
  phone = serializers.CharField(required=False, allow_blank=True, max_length=50)
  messenger = serializers.CharField(required=False, allow_blank=True, max_length=255)

  def validate(self, attrs):
    if attrs['password'] != attrs['password2']:
      raise serializers.ValidationError({"password2": "Пароли не совпадают"})
    email = User.objects.normalize_email(attrs['email'])
    if User.objects.filter(email=email).exists():
      raise serializers.ValidationError({"email": "Пользователь с таким email уже зарегистрирован"})
    attrs['email'] = email
    if attrs.get('phone') == '':
      attrs['phone'] = None
    if attrs.get('messenger') == '':
      attrs['messenger'] = None
    if attrs.get('last_name') == '':
      attrs['last_name'] = None
    return attrs

  def create(self, validated_data):
    validated_data.pop('password2')
    return User.objects.create_user(**validated_data)


class ChangePasswordSerializer(serializers.Serializer):
  old_password = serializers.CharField(write_only=True, required=True)
  new_password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
  new_password2 = serializers.CharField(write_only=True, required=True)

  def validate(self, attrs):
    if attrs['new_password'] != attrs['new_password2']:
      raise serializers.ValidationError({"new_password2": "Пароли не совпадают"})

    request = self.context.get('request')
    user = getattr(request, 'user', None)
    if user is None or not user.is_authenticated:
      raise serializers.ValidationError({"old_password": "Пользователь не аутентифицирован"})

    if not user.check_password(attrs['old_password']):
      raise serializers.ValidationError({"old_password": "Неверный текущий пароль"})

    return attrs

  def save(self, **kwargs):
    request = self.context.get('request')
    user = request.user
    new_password = self.validated_data['new_password']
    user.set_password(new_password)
    user.save(update_fields=['password'])
    return user