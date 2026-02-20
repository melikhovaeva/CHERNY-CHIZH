from django.shortcuts import render
from user_management.models import UserAccount
from rest_framework import generics, permissions
from user_management.serializers import RegisterSerializer, UserAccountSerializer

class RegisterView(generics.CreateAPIView):
  queryset = UserAccount.objects.all()
  permission_classes = (permissions.AllowAny,)
  serializer_class = RegisterSerializer
  
class ProfileView(generics.RetrieveUpdateDestroyAPIView):
  serializer_class = UserAccountSerializer
  permission_classes = (permissions.IsAuthenticated,)
  
  def get_object(self):
    return self.request.user