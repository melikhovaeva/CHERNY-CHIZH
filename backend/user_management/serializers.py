from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from user_management.models import User


class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = "__all__"
    read_only_fields = ("id", "date_joined", "is_active")


class CurrentUserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ("id", "email", "first_name", "last_name", "phone", "messenger")
    read_only_fields = ("id", "email")

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