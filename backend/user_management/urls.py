from django.urls import path
from .views import RegisterView, RegisterStep1View, RegisterStep2View, ProfileView

urlpatterns = [
    path('register/step1/', RegisterStep1View.as_view(), name='register-step1'),
    path('register/step2/', RegisterStep2View.as_view(), name='register-step2'),
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', ProfileView.as_view(), name='me'),
]