from user_management.models import UserAccount
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from user_management.serializers import (
  RegisterSerializer,
  RegisterStep1Serializer,
  RegisterStep2Serializer,
  UserAccountSerializer,
)


class RegisterView(generics.CreateAPIView):
  queryset = UserAccount.objects.all()
  permission_classes = (permissions.AllowAny,)
  serializer_class = RegisterSerializer


class RegisterStep1View(APIView):
  permission_classes = (permissions.AllowAny,)

  def post(self, request):
    serializer = RegisterStep1Serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response({"email": serializer.validated_data["email"]}, status=status.HTTP_200_OK)


class RegisterStep2View(APIView):
  permission_classes = (permissions.AllowAny,)

  def post(self, request):
    serializer = RegisterStep2Serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    return Response(
      {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "phone": user.phone,
        "telegram": user.telegram,
      },
      status=status.HTTP_201_CREATED,
    )


class ProfileView(generics.RetrieveUpdateDestroyAPIView):
  serializer_class = UserAccountSerializer
  permission_classes = (permissions.IsAuthenticated,)

  def get_object(self):
    return self.request.user