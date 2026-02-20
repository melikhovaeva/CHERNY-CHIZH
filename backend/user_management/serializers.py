from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from user_management.models import UserAccount

class UserAccountSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserAccount
    fields = '__all__'
    read_only_fields = ('id', 'date_joined', 'is_active')

class RegisterSerializer(serializers.ModelSerializer):
  password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
  password2 = serializers.CharField(write_only=True, required=True)
  
  class Meta:
    model = UserAccount
    fields = ('email', 'password', 'password2', 'first_name', 'last_name')

  def validate(self, attrs):
    if attrs['password'] != attrs['password2']:
      raise serializers.ValidationError({"password": "Пароли не совпадают"})
    return attrs

  def create(self, validated_data):
    validated_data.pop('password2')
    user = UserAccount.objects.create_user(**validated_data)
    return user


class RegisterStep1Serializer(serializers.Serializer):
  email = serializers.EmailField(required=True)
  password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
  password2 = serializers.CharField(write_only=True, required=True)

  def validate(self, attrs):
    if attrs['password'] != attrs['password2']:
      raise serializers.ValidationError({"password2": "Пароли не совпадают"})
    email = UserAccount.objects.normalize_email(attrs['email'])
    if UserAccount.objects.filter(email=email).exists():
      raise serializers.ValidationError({"email": "Пользователь с таким email уже зарегистрирован"})
    attrs['email'] = email
    return attrs


class RegisterStep2Serializer(serializers.Serializer):
  email = serializers.EmailField(required=True)
  password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
  password2 = serializers.CharField(write_only=True, required=True)
  first_name = serializers.CharField(required=True, max_length=255)
  last_name = serializers.CharField(required=True, max_length=255)
  phone = serializers.CharField(required=False, allow_blank=True, max_length=50)
  telegram = serializers.CharField(required=False, allow_blank=True, max_length=255)

  def validate(self, attrs):
    if attrs['password'] != attrs['password2']:
      raise serializers.ValidationError({"password2": "Пароли не совпадают"})
    email = UserAccount.objects.normalize_email(attrs['email'])
    if UserAccount.objects.filter(email=email).exists():
      raise serializers.ValidationError({"email": "Пользователь с таким email уже зарегистрирован"})
    attrs['email'] = email
    if attrs.get('phone') == '':
      attrs['phone'] = None
    if attrs.get('telegram') == '':
      attrs['telegram'] = None
    return attrs

  def create(self, validated_data):
    validated_data.pop('password2')
    return UserAccount.objects.create_user(**validated_data)